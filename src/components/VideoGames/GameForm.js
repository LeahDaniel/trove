import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const GameForm = () => {
    const history = useHistory()
    const currentGame = useLocation().state
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        multiplayerCapable: null,
        chosenPlatforms: new Set(),
        chosenCurrentPlatform: 0,
        tagArray: []
    })
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        multiplayer: true,
        multiPlatforms: true,
        singlePlatform: true,
        tags: true
    })
    const [firstAttempt, setFirstAttempt] = useState(true)


    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => TagRepo.getAll())
                .then(setTags)
                .then(checkValidity)
        }, []
    )
    useEffect(
        () => {
            if (currentGame) {
                userChoicesForCurrentGame()
            }
        }, [currentGame]
    )
    useEffect(
        () => {
            checkValidity()
        }, [userChoices]
    )

    const setPlatform = (id) => {
        const copy = { ...userChoices }
        copy.chosenPlatforms.has(id)
            ? copy.chosenPlatforms.delete(id)
            : copy.chosenPlatforms.add(id)
        setUserChoices(copy)
    }

    const userChoicesForCurrentGame = () => {
        //make copy of userChoices
        const copy = { ...userChoices }

        //change name, current, and multiplayer values based on currentGame values
        copy.name = currentGame.name
        copy.current = currentGame.current
        copy.multiplayerCapable = currentGame.multiplayerCapable

        //create a tag array from the currentGame's associated taggedGames, and set as userChoices.tagArray value
        let tagArray = []
        for (const taggedGame of currentGame.taggedGames) {
            tagArray.push(taggedGame.tag.tag)
        }
        copy.tagArray = tagArray

        //if a current game (only one platform possible), change chosenCurrentPlatform value base on platformId of first (and only) gamePlatform
        if (currentGame.current === true) {
            copy.chosenCurrentPlatform = currentGame.gamePlatforms[0].platformId
        } else {
            //if a queued game (more than one platform possible), create a Set of platformIds from the currentGame's associated gamePlatforms, and set as chosenPlatforms value
            let platformSet = new Set()
            for (const gamePlatform of currentGame.gamePlatforms) {
                platformSet.add(gamePlatform.platformId)
            }
            copy.chosenPlatforms = platformSet
        }

        //set user choices using the copy constructed above
        setUserChoices(copy)
    }

    const editGame = evt => {
        evt.preventDefault()

        const gameFromUserChoices = {
            name: userChoices.name,
            userId: parseInt(localStorage.getItem("trove_user")),
            current: userChoices.current,
            multiplayerCapable: userChoices.multiplayerCapable
        }

        GameRepo.deleteGamePlatformsForOneGame(currentGame)
            .then(() => TagRepo.deleteTaggedGamesForOneGame(currentGame))
            .then(() => GameRepo.modifyGame(gameFromUserChoices, currentGame.id))
            .then((addedGame) => {
                constructTags(addedGame)
                constructGamePlatforms(addedGame)
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/games/current")
                } else {
                    history.push("/games/queue")
                }
            })
    }

    const constructGame = evt => {
        evt.preventDefault()

        const gameFromUserChoices = {
            name: userChoices.name,
            userId: parseInt(localStorage.getItem("trove_user")),
            current: userChoices.current,
            multiplayerCapable: userChoices.multiplayerCapable
        }

        GameRepo.addGame(gameFromUserChoices)
            .then((addedGame) => {
                constructTags(addedGame)
                constructGamePlatforms(addedGame)
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/games/current")
                } else {
                    history.push("/games/queue")
                }
            })
    }

    const constructGamePlatforms = (addedGame) => {
        if (userChoices.chosenPlatforms.size > 0) {
            let promiseArray = []
            for (const chosenPlatform of userChoices.chosenPlatforms) {
                const newGamePlatform = {
                    gameId: addedGame.id,
                    platformId: chosenPlatform
                }
                promiseArray.push(GameRepo.addGamePlatform(newGamePlatform))
            }
            Promise.all(promiseArray)
        } else if (userChoices.chosenCurrentPlatform !== 0) {
            const newGamePlatform = {
                gameId: addedGame.id,
                platformId: userChoices.chosenCurrentPlatform
            }
            GameRepo.addGamePlatform(newGamePlatform)
        } else {
            console.log("Whoops! There were no platforms selected")
        }

    }

    const constructTags = (addedGame) => {
        const neutralizedTagsCopy = tags.map(tag => {
            const upperCased = tag.tag.toUpperCase()
            const noSpaces = upperCased.split(" ").join("")
            return {
                id: tag.id,
                tag: noSpaces
            }
        })


        for (const enteredTag of userChoices.tagArray) {
            const neutralizedEnteredTag = enteredTag.toUpperCase().split(" ").join("")
            let foundTag = neutralizedTagsCopy.find(tag => tag.tag === neutralizedEnteredTag)
            if (foundTag) {
                //post a new taggedGame object with that tag
                TagRepo.addTaggedGame({
                    tagId: foundTag.id,
                    gameId: addedGame.id
                })
            } else {
                //post a new tag object with that enteredTag
                TagRepo.addTag({ tag: enteredTag })
                    .then((newTag) => {
                        TagRepo.addTaggedGame({
                            tagId: newTag.id,
                            gameId: addedGame.id
                        })
                    })

                //post a new taggedGame object with the tag object made above

            }
        }
    }

    const checkValidity = () => {
        const invalidCopy = { ...invalid }
        //name
        if (userChoices.name === "") {
            invalidCopy.name = true
        } else {
            invalidCopy.name = false
        }
        //tags
        if (userChoices.tagArray.length === 0) {
            invalidCopy.tags = true
        } else {
            invalidCopy.tags = false
        }
        //multiplayer
        if (userChoices.multiplayerCapable === null) {
            invalidCopy.multiplayer = true
        } else {
            invalidCopy.multiplayer = false
        }
        //current
        if (userChoices.current === null) {
            invalidCopy.current = true
        } else {
            invalidCopy.current = false
        }
        //single and multi platform
        if (userChoices.chosenCurrentPlatform === 0 && userChoices.chosenPlatforms.size === 0) {
            invalidCopy.singlePlatform = true
            invalidCopy.multiPlatforms = true
        } else if (userChoices.chosenCurrentPlatform > 0 || userChoices.chosenPlatforms.size > 0) {
            invalidCopy.singlePlatform = false
            invalidCopy.multiPlatforms = false
        }

        setInvalid(invalidCopy)
    }

    return (
        <Form className="m-4 p-2">
            {
                currentGame
                    ? <h3> Edit a Game</h3>
                    : <h3> Add a New Game</h3>
            }
            <FormGroup className="mt-4" row>
                <Label for="gameTitle">
                    Game Title
                </Label>
                <Input
                    id="gameTitle"
                    name="title"
                    invalid={!firstAttempt ? invalid.name : false}
                    value={userChoices.name}
                    onChange={(event) => {
                        const copy = { ...userChoices }
                        copy.name = event.target.value
                        setUserChoices(copy)
                    }}
                    className="mb-2"
                />
            </FormGroup>
            <FormGroup row>
                <Label
                    for="gameTags"
                >
                    Genre Tags
                </Label>
                <Input
                    id="gameTags"
                    type="textarea"
                    invalid={!firstAttempt ? invalid.tags : false}
                    value={userChoices.tagArray.join(", ")}
                    onChange={(event) => {
                        const copy = { ...userChoices }
                        copy.tagArray = event.target.value.split(", ")
                        setUserChoices(copy)
                    }}
                />
                <FormText className="mb-2">
                    Enter tag names, separated by commas and spaces. Ex: "horror, RPG, first-person shooter"
                </FormText>
            </FormGroup>
            <FormGroup>
                <Label for="multiplayerSelect">
                    Multiplayer Capable?
                </Label>
                <Input
                    id="multiplayerSelect"
                    type="select"
                    invalid={!firstAttempt ? invalid.multiplayer : false}
                    value={userChoices.multiplayerCapable === null
                        ? "Choose an option..."
                        : userChoices.multiplayerCapable === true
                            ? "Yes"
                            : "No"
                    }
                    onChange={(event) => {
                        const copy = { ...userChoices }

                        if (event.target.value === "Yes") {
                            copy.multiplayerCapable = true
                        } else if (event.target.value === "No") {
                            copy.multiplayerCapable = false
                        } else {
                            copy.multiplayerCapable = null
                        }
                        setUserChoices(copy)
                    }
                    }
                >
                    <option>
                        Choose an option...
                    </option>
                    <option>
                        Yes
                    </option>
                    <option>
                        No
                    </option>
                </Input>
                <FormText className="mb-2">
                    Does this game have an option for multiplayer (online or local)?
                </FormText>
            </FormGroup>
            <FormGroup>
                <Label for="exampleSelect">
                    Current or Queued?
                </Label>
                <Input
                    id="currentSelect"
                    type="select"
                    invalid={!firstAttempt ? invalid.current : false}
                    value={userChoices.current === null
                        ? "Choose an option..."
                        : userChoices.current === true
                            ? "Current"
                            : "Queued"
                    }
                    onChange={(event) => {
                        const copy = { ...userChoices }

                        if (event.target.value === "Current") {
                            copy.current = true
                            copy.chosenPlatforms.clear()
                        } else if (event.target.value === "Queued") {
                            copy.current = false
                            copy.chosenCurrentPlatform = 0
                        } else {
                            copy.current = null
                            copy.chosenCurrentPlatform = 0
                            copy.chosenPlatforms.clear()
                        }
                        setUserChoices(copy)
                    }
                    }
                >
                    <option>
                        Choose an option...
                    </option>
                    <option>
                        Current
                    </option>
                    <option>
                        Queued
                    </option>
                </Input>
                <FormText className="mb-2">
                    Have you started this game (current) or are you thinking of playing it in the future (queued)?
                </FormText>
            </FormGroup>
            {
                userChoices.current === null ? "" :
                    userChoices.current === true
                        ? <FormGroup>
                            <Label for="exampleSelect">
                                Platform
                            </Label>
                            <Input
                                id="currentSelect"
                                type="select"
                                invalid={!firstAttempt ? invalid.singlePlatform : false}
                                value={userChoices.chosenCurrentPlatform}
                                onChange={(event) => {
                                    const copy = { ...userChoices }
                                    copy.chosenCurrentPlatform = parseInt(event.target.value)
                                    setUserChoices(copy)
                                }}
                            >
                                <option value="0">
                                    Choose an option...
                                </option>
                                {
                                    platforms.map(platform => {
                                        return <option value={platform.id} key={platform.id}>
                                            {platform.name}
                                        </option>
                                    })

                                }
                            </Input>
                            <FormText>
                                Select the platform you are currently playing the game on.
                            </FormText>
                        </FormGroup>
                        : <FormGroup
                            row
                            tag="fieldset"
                        >
                            <Label>
                                Platforms
                            </Label>
                            {
                                platforms.map(platform => {
                                    return <FormGroup key={`platform--${platform.id}`} check>
                                        <Input
                                            className="platformCheckbox"
                                            type="checkbox"
                                            invalid={!firstAttempt ? invalid.multiPlatforms : false}
                                            checked={userChoices.chosenPlatforms.has(platform.id) ? true : false}
                                            onChange={() => {
                                                setPlatform(platform.id)
                                            }}
                                        />
                                        {' '}
                                        <Label check>
                                            {platform.name}
                                        </Label>
                                    </FormGroup>
                                })
                            }
                            <FormText>
                                Select each platform the game is available on and you own.
                            </FormText>
                        </FormGroup>
            }
            <FormGroup>
                <Button onClick={(evt) => {
                    evt.preventDefault()

                    setFirstAttempt(false)

                    //check if every key on the "invalid" object is false
                    if (Object.keys(invalid).every(key => invalid[key] === false)) {
                        currentGame
                            ? editGame(evt)
                            : constructGame(evt)
                    }
                }}>
                    Submit
                </Button>
                {currentGame
                    ? <Button onClick={() => { history.goBack() }}>
                        Cancel
                    </Button>
                    : ""
                }


            </FormGroup>
        </Form >
    )
}
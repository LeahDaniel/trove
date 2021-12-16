import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'

export const GameForm = () => {
    const history = useHistory()
    const presentGame = useLocation().state
    const [platforms, setPlatforms] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [tags, setTags] = useState([])
    //initialize object to hold user choices from form, and/or location.state (on edit of game)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        multiplayerCapable: null,
        chosenPlatforms: new Set(),
        chosenCurrentPlatform: 0,
        tagArray: []
    })
    //initialize object to control "invalid" prop on inputs
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        multiplayer: true,
        multiPlatforms: true,
        singlePlatform: true,
    })
    //initialize boolean to indicate whether the user is on their first form attempt (prevent form warnings on first attempt)
    const [firstAttempt, setFirstAttempt] = useState(true)
    const [alert, setAlert] = useState(false)


    useEffect(
        () => {
            //on page load, GET platforms and tags
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => TagRepo.getTagsForUser(userId))
                .then(result => {
                    const sorted = result.sort((a, b) => {
                        const tagA = a.tag.toLowerCase()
                        const tagB = b.tag.toLowerCase()
                        if (tagA < tagB) { return -1 }
                        if (tagA > tagB) { return 1 }
                        return 0 //default return value (no sorting)
                    })
                    setTags(sorted)
                })
                //setInvalid on page load to account for pre-populated fields on edit.
                .then(checkValidity)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )
    useEffect(
        () => {
            if (presentGame) {
                //on presentGame state change (when user clicks edit to be brought to form)
                //setUserChoices from the values of the presentGame object
                userChoicesForPresentGame()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [presentGame]
    )
    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            checkValidity()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userChoices]
    )

    //check for parameter's value in chosenPlatforms. Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setPlatform = (id) => {
        const copy = { ...userChoices }
        copy.chosenPlatforms.has(id)
            ? copy.chosenPlatforms.delete(id)
            : copy.chosenPlatforms.add(id)
        setUserChoices(copy)
    }

    //setUserChoices from the values of the presentGame object
    const userChoicesForPresentGame = () => {
        //make copy of userChoices
        const copy = { ...userChoices }

        //change name, current, and multiplayer values based on presentGame values
        copy.name = presentGame.name
        copy.current = presentGame.current
        copy.multiplayerCapable = presentGame.multiplayerCapable

        //create a tag array from the presentGame's associated taggedGames, and set as userChoices.tagArray value
        let tagArray = []
        for (const taggedGame of presentGame.taggedGames) {
            tagArray.push({ label: taggedGame.tag.tag, value: taggedGame.tag.id })
        }
        copy.tagArray = tagArray
        //if a current game (only one platform possible), change chosenCurrentPlatform value based on platformId of first (and only) gamePlatform
        if (presentGame.current === true) {
            copy.chosenCurrentPlatform = presentGame.gamePlatforms[0].platformId
        } else {
            //if a queued game (more than one platform possible), create a Set of platformIds from the presentGame's associated gamePlatforms, and set as chosenPlatforms value
            let platformSet = new Set()
            for (const gamePlatform of presentGame.gamePlatforms) {
                platformSet.add(gamePlatform.platformId)
            }
            copy.chosenPlatforms = platformSet
        }

        //set user choices using the copy constructed above
        setUserChoices(copy)
    }

    //Deletes present taggedGames and gamePlatforms for presentGame being edited. 
    // Then, PUT operation to games based on userChoices.
    //Then, POST operations to tags, taggedGames, and gamePlatforms using the 
    //constructTags and constructGamePlatforms functions, with the edited game's id as an argument
    //Then, push user to current or queued based on if current on game is true or false
    const editGame = evt => {
        evt.preventDefault()

        const gameFromUserChoices = {
            name: userChoices.name,
            userId: parseInt(localStorage.getItem("trove_user")),
            current: userChoices.current,
            multiplayerCapable: userChoices.multiplayerCapable
        }

        GameRepo.deleteGamePlatformsForOneGame(presentGame)
            .then(() => TagRepo.deleteTaggedGamesForOneGame(presentGame))
            .then(() => GameRepo.modifyGame(gameFromUserChoices, presentGame.id))
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

    //POST operation to games
    //Then, POST operations to tags, taggedGames, and gamePlatforms using the 
    //constructTags and constructGamePlatforms functions, with the posted game's id as an argument
    //Then, push user to current or queued based on if current on game is true or false
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

    //uses either the chosenPlatforms Set or the chosenCurrentPlatform id to POST each gamePlatform
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
        }
    }

    //uses the tagArray to POST to tags (if it does not yet exist), and to POST taggedGames objects.
    //tags will be evaluated as the same even if capitalization and spaces are different.
    const constructTags = (addedGame) => {

        for (const enteredTag of userChoices.tagArray) {
            if (enteredTag.__isNew__) {
                //post a new tag object with that enteredTag
                TagRepo.addTag({ tag: enteredTag.value, userId: userId })
                    .then((newTag) => {
                        TagRepo.addTaggedGame({
                            tagId: newTag.id,
                            gameId: addedGame.id
                        })
                    })
                //post a new taggedGame object with the tag object made above
            } else {
                //post a new taggedGame object with that tag
                TagRepo.addTaggedGame({
                    tagId: parseInt(enteredTag.value),
                    gameId: addedGame.id
                })

            }
        }
    }

    //use the userChoices values to set the invalid booleans (was the user entry a valid entry or not)
    const checkValidity = () => {
        const invalidCopy = { ...invalid }
        //name
        if (userChoices.name === "") {
            invalidCopy.name = true
        } else {
            invalidCopy.name = false
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
                presentGame
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
                    //if this is not the first attempt at filling out the form, allow the 
                    //input to be marked as invalid (if the invalid state is true)
                    //Otherwise, do not mark field as invalid
                    invalid={!firstAttempt ? invalid.name : false}
                    //set value based on userChoices to allow form to pre-populate if user was pushed to form from edit button
                    //and so that the displayed entry changes as the user edits it (because of onChange)
                    value={userChoices.name}
                    //on change on field, set userChoices
                    onChange={(event) => {
                        const copy = { ...userChoices }
                        copy.name = event.target.value
                        setUserChoices(copy)
                    }}
                    className="mb-2"
                />
            </FormGroup>
            <FormGroup>
                <Label>Genre Tags</Label>
                <CreatableSelect
                    isMulti
                    isClearable
                    value={userChoices.tagArray}
                    options={
                        tags.map(tag => ({ label: tag.tag, value: tag.id }))
                    }
                    onChange={optionChoices => {
                        const copy = { ...userChoices }
                        copy.tagArray = optionChoices
                        setUserChoices(copy)
                    }}
                    id="tagSelect"
                    placeholder="Select or create tags..."
                />
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
            {
                alert && presentGame
                    ?
                    <div>
                        <Alert
                            color="danger"
                        >
                            Please complete all required (!) fields. If you have no edits, click "Cancel".
                        </Alert>
                    </div>
                    : alert && !presentGame
                        ? <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields before submitting.
                            </Alert>
                        </div>
                        : ""
            }
            <FormGroup>
                <Button onClick={(evt) => {
                    evt.preventDefault()

                    setFirstAttempt(false)

                    //check if every key on the "invalid" object is false
                    if (Object.keys(invalid).every(key => invalid[key] === false)) {
                        presentGame
                            ? editGame(evt)
                            : constructGame(evt)
                    } else {
                        setAlert(true)
                    }
                }}>
                    Submit
                </Button>
                {presentGame
                    //if there is a presentGame object (user was pushed to form from edit button), allow them to go back to the previous page they were on (the appropriate list)
                    ? <Button onClick={() => { history.goBack() }}>
                        Cancel
                    </Button>
                    : ""
                }


            </FormGroup>
        </Form >
    )
}
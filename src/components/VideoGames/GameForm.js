import React, { useState, useEffect } from "react"
import { useHistory } from "react-router"
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const GameForm = () => {
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        multiplayerCapable: false,
        chosenPlatforms: new Set(),
        chosenCurrentPlatform: 0,
        tagString: ""
    })
    const history = useHistory()

    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => TagRepo.getAll())
                .then(setTags)
        }, []
    )

    const setPlatform = (id) => {
        const copy = { ...userChoices }
        copy.chosenPlatforms.has(id)
            ? copy.chosenPlatforms.delete(id)
            : copy.chosenPlatforms.add(id)
        setUserChoices(copy)
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
                //     constructTags(addedGame)
                constructGamePlatforms(addedGame)
                if (addedGame.current === true) {
                    history.push("/games/current")
                } else {
                    history.push("/games/queue")
                }
            })
    }

    const constructGamePlatforms = (addedGame) => {
        if(userChoices.chosenPlatforms.size > 0){
            let promiseArray = []
            for(const chosenPlatform of userChoices.chosenPlatforms){
                const newGamePlatform = {
                    gameId: addedGame.id,
                    platformId: chosenPlatform
                }
                promiseArray.push(GameRepo.addGamePlatform(newGamePlatform))
            }
            Promise.all(promiseArray)
            .then(console.log("All done with promises!"))
        } else if(userChoices.chosenCurrentPlatform !== 0){
            const newGamePlatform = {
                gameId: addedGame.id,
                platformId: userChoices.chosenCurrentPlatform
            }
            GameRepo.addGamePlatform(newGamePlatform)
        } else {
            console.log("Whoops! There were no platforms selected")
        }
        
    }


    return (
        <Form>
            <FormGroup row>
                <Label for="gameTitle">
                    Game Title
                </Label>
                <Input
                    id="gameTitle"
                    name="title"
                    placeholder="Enter the title of the game"
                    onChange={(event) => {
                        const copy = { ...userChoices }
                        copy.name = event.target.value
                        setUserChoices(copy)
                    }}
                />
            </FormGroup>
            <FormGroup row>
                <Label for="gameTags">
                    Genre Tags
                </Label>
                <Input
                    id="gameTags"
                    name="tags"
                    type="textarea"
                    placeholder="Enter tags, separated by commas"
                    onChange={(event) => {
                        const copy = { ...userChoices }
                        copy.tagString = event.target.value
                        setUserChoices(copy)
                    }}
                />
                <FormText>
                    Ex: "horror, RPG, first-person shooter"
                </FormText>
            </FormGroup>
            <FormGroup check>
                <Input
                    id="multiplayerCheckbox"
                    type="checkbox"
                    onChange={() => {
                        const copy = { ...userChoices }
                        copy.multiplayerCapable = !copy.multiplayerCapable
                        setUserChoices(copy)
                    }}
                />
                <Label check for="multiplayerCheckbox">
                    Multiplayer Capable
                </Label>
            </FormGroup>
            <FormGroup>
                <Label for="exampleSelect">
                    Current or Queued?
                </Label>
                <Input
                    id="currentSelect"
                    name="select"
                    type="select"
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
                                name="select"
                                type="select"
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
                                            onClick={() => setPlatform(platform.id)}
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
                <Button onClick={constructGame}>
                    Submit
                </Button>
            </FormGroup>
        </Form>
    )
}
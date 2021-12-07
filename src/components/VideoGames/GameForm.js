import React, { useState, useEffect } from "react"
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import GameRepo from "../../repositories/GameRepo"

export const GameForm = () => {
    const [platforms, setPlatforms] = useState([])
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        multiplayerCapable: false,
        chosenPlatforms: new Set(),
        chosenCurrentPlatform: 0
    })

    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
        }, []
    )

    const setPlatform = (id) => {
        const copy = { ...userChoices }

        copy.chosenPlatforms.has(id)
            ? copy.chosenPlatforms.delete(id)
            : copy.chosenPlatforms.add(id)

        setUserChoices(copy)
    }


    return (
        <Form>
            <FormGroup row>
                <Label
                    for="gameTitle"
                >
                    Game Title
                </Label>
                <Input
                    id="gameTitle"
                    name="title"
                    placeholder="Enter the title of the game"
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
                    name="tags"
                    type="textarea"
                    placeholder="Enter tags, separated by commas"
                />
                <FormText>
                    Ex: "horror, RPG, first-person shooter"
                </FormText>
            </FormGroup>
            <FormGroup check>
                <Input
                    id="checkbox7"
                    type="checkbox"
                />
                <Label
                    check
                    for="checkbox7"
                >
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
                                }
                                }
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
                            {/* //! Move this below the current game checkbox, only show checkboxes if 
                //! This is a queue. Otherwise, show dropdown.
                //! When moving the queue to current, if there is more than one gamePlatform,
                //! Cause pop-up asking which platform you chose to play it on. */}
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
                <Button>
                    Submit
                </Button>
            </FormGroup>
        </Form>
    )
}
import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchGames = ({ userEntries, setUserEntries, taggedGames }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const [tagsForGames, setTagsForGames] = useState([])


    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => TagRepo.getTagsForUser(userId))
                .then(result => {
                    setTags(sortByTag(result))
                })
        }, [userId]
    )

    useEffect(
        () => {
            const newArray = tags.filter(tag => {
                const foundTag = taggedGames.find(taggedGame => taggedGame.tagId === tag.id)
                if(foundTag){
                    return true
                } else {
                    return false
                }
            })
            setTagsForGames(newArray)
        }, [taggedGames, tags]
    )

    //check for parameter's value in chosenPlatforms. Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setTag = (id) => {
        const copy = { ...userEntries }
        copy.tags.has(id)
            ? copy.tags.delete(id)
            : copy.tags.add(id)
        setUserEntries(copy)
    }

    const multiplayerValue = () => {
        if (userEntries.multiplayer === true) {
            return "1"
        } else if (userEntries.multiplayer===false) {
            return "2"
        } else {
            return "0"
        }
    }

    return (
        <Form className="pb-2 mt-5 px-2 bg-light border" inline>

            <h5 className="text-center py-3">Filters</h5>

            <FormGroup>
                <Label for="nameSearch">
                    Search by Title
                </Label>
                <Input
                    id="nameSearch"
                    type="search"
                    placeholder="Title contains..."
                    value={userEntries.name}
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.name = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                />
            </FormGroup>
            <FormGroup>
                <Label for="platformSelect">
                    Platform
                </Label>
                <Input
                    id="platformSelect"
                    name="select"
                    type="select"
                    value={userEntries.platform}
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.platform = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                >
                    <option value="0"> Select one... </option>
                    {platforms.map(platform => {
                        return <option value={platform.id} key={platform.id}>{platform.name}</option>
                    })}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="multiplayerSelect">
                    Multiplayer Capable
                </Label>
                <Input
                    id="multiplayerSelect"
                    name="select"
                    type="select"
                    value={multiplayerValue()}
                    onChange={(event) => {
                        const copy = { ...userEntries }

                        if (event.target.value === "1") {
                            copy.multiplayer = true
                        } else if (event.target.value === "2") {
                            copy.multiplayer = false
                        } else {
                            copy.multiplayer = null
                        }
                        setUserEntries(copy)
                    }}
                >
                    <option value="0"> Select one... </option>
                    <option value="1"> Yes </option>
                    <option value="2"> No </option>

                </Input>
            </FormGroup>
            <FormGroup >
                <Label>
                    Tags
                </Label>
                <div>
                    {
                        tagsForGames.length > 0
                            ? tagsForGames.map(tag => {
                                return <Button
                                    key={`tag--${tag.id}`}
                                    active={userEntries.tags.has(tag.id) ? true : false}
                                    color="info"
                                    style={{ color: "#000000", borderRadius: '20px' }}
                                    outline
                                    size="sm"
                                    className="m-2"
                                    onClick={() => setTag(tag.id)}
                                >
                                    {tag.tag}
                                </Button>

                            })
                            : ""
                    }
                </div>
            </FormGroup>
            <FormGroup className='row justify-content-center'>
                <Button
                    onClick={() => {
                        let userEntriesCopy = { ...userEntries }
                        userEntriesCopy = {
                            name: "",
                            multiplayer: null,
                            platform: "0",
                            tags: new Set()
                        }
                        setUserEntries(userEntriesCopy)
                    }
                    }
                    className="col-4 mt-2"
                >
                    Clear
                </Button>
            </FormGroup>
        </Form>
    )
}
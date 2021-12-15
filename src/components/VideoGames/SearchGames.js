import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchGames = ({ userEntries, setUserEntries }) => {
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))


    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => TagRepo.getTagsForUser(userId))
                .then(setTags)
        }, [userId]
    )

    return (
        <Form className="pb-5 mt-5 px-2 bg-light border"inline>

            <h5 className="text-center py-3">Filters</h5>

            <FormGroup>
                <Label for="nameSearch">
                    Search by Title
                </Label>
                <Input
                    id="nameSearch"
                    type="search"
                    placeholder="Title contains..."
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.name = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                />
            </FormGroup>
            {' '}
            <FormGroup>
                <Label for="platformSelect">
                    Platform
                </Label>
                <Input
                    id="platformSelect"
                    name="select"
                    type="select"
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
            <FormGroup>
                <Label for="tagSelect">
                    Tag
                </Label>
                <Input
                    id="tagSelect"
                    name="select"
                    type="select"
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.tag = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                >
                    <option value="0"> Select one... </option>
                    {tags.map(tag => {
                        return <option value={tag.id} key={tag.id}>{tag.tag}</option>
                    })}
                </Input>
            </FormGroup>
            {' '}
        </Form>
    )
}
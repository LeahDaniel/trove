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
        <Form inline>
            <h6>Search by:</h6>

            <FormGroup floating>
                <Input
                    id="nameSearch"
                    type="search"
                    placeholder="Title"
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.name = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                />
                <Label for="nameSearch">
                    Title
                </Label>
            </FormGroup>
            {' '}

            <h6>Filter by:</h6>

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
                    <option value="0"> Choose to filter... </option>
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
                    <option value="0"> Choose to filter... </option>
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
                    <option value="0"> Choose to filter... </option>
                    {tags.map(tag => {
                        return <option value={tag.id} key={tag.id}>{tag.tag}</option>
                    })}
                </Input>
            </FormGroup>
            {' '}
        </Form>
    )
}
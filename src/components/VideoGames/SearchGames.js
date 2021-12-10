import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchGames = ({ nameSetter, multiplayerSetter }) => {
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])

    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => {
                    TagRepo.getTagsForUser()
                        .then(setTags)
                })
        }, []
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
                        nameSetter(event.target.value)
                    }}
                />
                <Label for="nameSearch">
                    Title
                </Label>
            </FormGroup>
            {' '}

            <h6>Filter by:</h6>

            <FormGroup>
                <Input
                    id="exampleSelect"
                    name="select"
                    type="select"
                >
                    <option value="0"> Platform </option>
                    {platforms.map(platform => {
                        <option value={platform.id}>{platform.name}</option>
                    })}
                </Input>
            </FormGroup>
            {' '}
        </Form>
    )
}
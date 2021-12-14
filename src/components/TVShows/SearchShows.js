import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchShows = ({ userEntries, setUserEntries }) => {
    const [tags, setTags] = useState([])
    const [streamingServices, setStreamingServices] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(setTags)
                .then(ShowRepo.getAllStreamingServices)
                .then(setStreamingServices)
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
                    Streaming Service
                </Label>
                <Input
                    id="platformSelect"
                    name="select"
                    type="select"
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.service = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                >
                    <option value="0"> Choose to filter... </option>
                    {
                        streamingServices.map(service => {
                            return <option key={service.id} value={service.id}>{service.service}</option>
                        })
                    }
                    
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
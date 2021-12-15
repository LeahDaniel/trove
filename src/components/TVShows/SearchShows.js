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
        <Form className="pb-5 mt-5 px-2 bg-light border" inline>

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
                    <option value="0"> Select one... </option>
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
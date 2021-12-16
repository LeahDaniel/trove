import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchShows = ({ userEntries, setUserEntries, taggedShows }) => {
    const [tags, setTags] = useState([])
    const [streamingServices, setStreamingServices] = useState([])
    const [tagsForShows, setTagsForShows] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
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
                .then(ShowRepo.getAllStreamingServices)
                .then(setStreamingServices)
        }, [userId]
    )

    useEffect(
        () => {
            const newArray = tags.filter(tag => {
                const foundTag = taggedShows.find(taggedShow => taggedShow.tagId === tag.id)
                if(foundTag){
                    return true
                } else {
                    return false
                }
            })
            setTagsForShows(newArray)
        }, [taggedShows, tags]
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
                    {tagsForShows.map(tag => {
                        return <option value={tag.id} key={tag.id}>{tag.tag}</option>
                    })}
                </Input>
            </FormGroup>
            {' '}
        </Form>
    )
}
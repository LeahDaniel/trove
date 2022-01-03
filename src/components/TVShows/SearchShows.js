import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { sortByTag } from "../../repositories/FetchAndSort"
import { ShowRepo } from "../../repositories/ShowRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchShows = ({ userEntries, setUserEntries, taggedShows }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [tags, setTags] = useState([])
    const [streamingServices, setStreamingServices] = useState([])
    const [tagsForShows, setTagsForShows] = useState([])

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(result => {
                    setTags(sortByTag(result))
                })
                .then(ShowRepo.getAllStreamingServices)
                .then(setStreamingServices)
        }, [userId]
    )

    useEffect(
        () => {
            const newArray = tags.filter(tag => {
                const foundTag = taggedShows.find(taggedShow => taggedShow.tagId === tag.id)
                if (foundTag) {
                    return true
                } else {
                    return false
                }
            })
            setTagsForShows(newArray)
        }, [taggedShows, tags]
    )

    //check for parameter's value in chosenPlatforms. Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setTag = (id) => {
        const copy = { ...userEntries }
        copy.tags.has(id)
            ? copy.tags.delete(id)
            : copy.tags.add(id)
        setUserEntries(copy)
    }

    return (
        <Form className="pb-2 mt-5 px-2 bg-secondary shadow-sm rounded" inline>

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
                    Streaming Service
                </Label>
                <Input
                    id="platformSelect"
                    name="select"
                    type="select"
                    value={userEntries.service}
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.service = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                >
                    <option value="0"> Select one... </option>
                    {
                        streamingServices.map(service => {
                            return <option key={service.id} value={service.id}>{service.service} </option>
                        })
                    }

                </Input>
            </FormGroup>
            <FormGroup>
                <Label>
                    Tags
                </Label>
                <div>
                    {
                        tagsForShows.length > 0
                            ? tagsForShows.map(tag => {
                                return <Button
                                    key={`tag--${tag.id}`}
                                    active={userEntries.tags.has(tag.id) ? true : false}
                                    color="checkbox"
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
                            service: "0",
                            tags: new Set()
                        }
                        setUserEntries(userEntriesCopy)
                    }
                    }
                    color="info"
                    className="col-5 mt-2 text-white"
                    size="sm"
                >
                    Clear Filters
                </Button>
            </FormGroup>
        </Form>
    )
}
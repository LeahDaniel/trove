import { useState, useEffect } from "react"
import { Button, ButtonGroup, Form, FormGroup, Input, Label } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"

export const FilterForm = ({ userEntries, setUserEntries }) => {
    const [tags, setTags] = useState([])
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
        }, [userId]
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
        <Form inline>
            <FormGroup floating >
                <Input
                    id="titleSearch"
                    type="search"
                    placeholder="Search by Title"
                    value={userEntries.title}
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.title = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}

                />
                <Label for="titleSearch">
                    Search by Title
                </Label>
            </FormGroup>

            {
                tags.length > 0
                    ? tags.map(tag => {
                        return <ButtonGroup key={`tag--${tag.id}`}>
                            <Button
                                active={userEntries.tags.has(tag.id) ? true : false}
                                color="info"
                                style={{color: "#000000", borderRadius:'20px'}}
                                outline
                                size="sm"
                                className="m-2"
                                onClick={() => setTag(tag.id)}
                            >
                                {tag.tag}
                            </Button>
                        </ButtonGroup>
                    })
                    : ""
            }
            <FormGroup className='row justify-content-center'>
                <Button
                    onClick={() => {
                        let userEntriesCopy = { ...userEntries }
                        userEntriesCopy = {
                            title: "",
                            tags: new Set()
                        }
                        setUserEntries(userEntriesCopy)
                    }
                    }
                    className="col-1 mt-4"  
                >
                    Clear Filters
                </Button>
            </FormGroup>
        </Form>
    )
}
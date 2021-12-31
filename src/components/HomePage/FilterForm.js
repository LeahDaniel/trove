import { useState, useEffect } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"

export const FilterForm = ({ userEntries, setUserEntries }) => {
    const [tags, setTags] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(result => {
                    setTags(sortByTag(result))
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
        <div className="col-3">
            <Form  className="pb-2 mt-5 px-3 bg-light border" inline>

                <h5 className="text-center py-3">Filters</h5>

                <FormGroup>
                    <Label for="titleSearch">
                        Search by Title
                    </Label>
                    <Input
                        id="titleSearch"
                        type="search"
                        placeholder="Title contains..."
                        value={userEntries.title}
                        onChange={(event) => {
                            const userEntriesCopy = { ...userEntries }
                            userEntriesCopy.title = event.target.value
                            setUserEntries(userEntriesCopy)
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        Tags
                    </Label>
                    <div>
                        {
                            tags.length > 0
                                ? tags.map(tag => {
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
                                title: "",
                                tags: new Set()
                            }
                            setUserEntries(userEntriesCopy)
                        }
                        }
                        className="col-sm-6 col-lg-4 mt-2"
                    >
                        Clear
                    </Button>
                </FormGroup>
            </Form>
        </div>
    )
}
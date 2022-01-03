import { useState, useEffect } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { sortByTag } from "../../repositories/FetchAndSort"
import { TagRepo } from "../../repositories/TagRepo"

export const FilterForm = ({ userEntries, setUserEntries }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [tags, setTags] = useState([])

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(result => {
                    setTags(sortByTag(result))
                })
        }, [userId]
    )

    //check for parameter's value in userEntries.tags Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setTag = (id) => {
        const copy = { ...userEntries }
        copy.tags.has(id)
            ? copy.tags.delete(id)
            : copy.tags.add(id)
        setUserEntries(copy)
    }

    return (
        <div className="col-3">
            <Form  className="pb-2 mt-5 px-3 bg-secondary shadow-sm rounded" inline>

                <h5 className="text-center pt-5 pb-4">Filters</h5>

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
                    <div className="d-flex flex-row flex-wrap justify-content-start">
                        {
                            tags.length > 0
                                ? tags.map(tag => {
                                    return <Button
                                        key={`tag--${tag.id}`}
                                        active={userEntries.tags.has(tag.id) ? true : false}
                                        color="checkbox"
                                        style={{ color: "#000000", borderRadius: '20px',fontWeight: 500 }}
                                        outline
                                        size="sm"
                                        className="mx-1 my-2 text-truncate"
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
                            const reset = {
                                title: "",
                                tags: new Set()
                            }
                            setUserEntries(reset)
                        }
                        }
                        color="info"
                        size="sm"
                        className="col-sm-11 col-md-9 col-lg-7 col-xl-5 mt-2 text-white"
                    >
                        Clear Filters
                    </Button>
                </FormGroup>
            </Form>
        </div>
    )
}
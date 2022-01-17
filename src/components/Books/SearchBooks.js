import React, { useEffect, useState } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { sortByName, sortByTag } from "../../repositories/FetchAndSort"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchBooks = ({ userEntries, setUserEntries, taggedBooks }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [tags, setTags] = useState([])
    const [tagsForBooks, setTagsForBooks] = useState([])
    const [authors, setAuthors] = useState([])

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(result => {
                    setTags(sortByTag(result))
                })
                .then(() => BookRepo.getAuthorsForUser(userId))
                .then(result => {
                    setAuthors(sortByName(result))
                })
        }, [userId]
    )

    useEffect(
        () => {
            const newArray = tags.filter(tag => {
                const foundTag = taggedBooks.find(taggedBook => taggedBook.tagId === tag.id)
                if (foundTag) {
                    return true
                } else {
                    return false
                }
            })
            setTagsForBooks(newArray)
        }, [taggedBooks, tags]
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
        <Form className="pb-2 mt-5 px-3 bg-secondary shadow-sm rounded text-white" inline>

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
                <Label for="authorSelect">
                    Author
                </Label>
                <Input
                    id="authorSelect"
                    name="select"
                    type="select"
                    value={userEntries.author}
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.author = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                >
                    <option value="0"> Select one... </option>
                    {
                        authors.map(author => {
                            return <option key={author.id} value={author.id}>{author.name}</option>
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
                        tagsForBooks.length > 0
                            ? tagsForBooks.map(tag => {
                                return <Button
                                    key={`tag--${tag.id}`}
                                    active={userEntries.tags.has(tag.id) ? true : false}
                                    color="checkbox"
                                    style={{ borderRadius: '20px' }}
                                    outline
                                    size="sm"
                                    className="mx-1 my-2 text-white"
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
                            author: "0",
                            tags: new Set()
                        }
                        setUserEntries(userEntriesCopy)
                    }
                    }
                    size="sm"
                    color="info"
                    className="col-sm-9 col-md-7 col-lg-5 mt-2"
                >
                    Clear Filters
                </Button>
            </FormGroup>
        </Form>
    )
}
import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button, ButtonGroup, Form, FormGroup, Input, Label } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchBooks = ({ userEntries, setUserEntries, taggedBooks }) => {
    const [tags, setTags] = useState([])
    const [tagsForBooks, setTagsForBooks] = useState([])
    const [authors, setAuthors] = useState([])
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
                .then(() => BookRepo.getAuthorsForUser(userId))
                .then(result => {
                    const sorted = result.sort((a, b) => {
                        const nameA = a.name.toLowerCase()
                        const nameB = b.name.toLowerCase()
                        if (nameA < nameB) { return -1 }
                        if (nameA > nameB) { return 1 }
                        return 0 //default return value (no sorting)
                    })
                    setAuthors(sorted)
                })   
        }, [userId]
    )

    useEffect(
        () => {
            const newArray = tags.filter(tag => {
                const foundTag = taggedBooks.find(taggedBook => taggedBook.tagId === tag.id)
                if(foundTag){
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
            {
                tagsForBooks.length > 0
                    ? tagsForBooks.map(tag => {
                        return <ButtonGroup key={`tag--${tag.id}`}>
                            <Button
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
                        </ButtonGroup>
                    })
                    : ""
            }
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
                    className="col-4 mt-4"
                >
                    Clear Filters
                </Button>
            </FormGroup>
        </Form>
    )
}
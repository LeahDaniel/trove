import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Form, FormGroup, Input, Label } from "reactstrap"
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
                <Label for="authorSelect">
                    Author
                </Label>
                <Input
                    id="authorSelect"
                    name="select"
                    type="select"
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
                    {tagsForBooks.map(tag => {
                        return <option value={tag.id} key={tag.id}>{tag.tag}</option>
                    })}
                </Input>
            </FormGroup>
            {' '}
        </Form>
    )
}
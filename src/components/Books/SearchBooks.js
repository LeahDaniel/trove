import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchBooks = ({ userEntries, setUserEntries }) => {
    const [tags, setTags] = useState([])
    const [authors, setAuthors] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(setTags)
                .then(() => BookRepo.getAuthorsForUser(userId))
                .then(setAuthors)
        }, []
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
                    Author
                </Label>
                <Input
                    id="platformSelect"
                    name="select"
                    type="select"
                    onChange={(event) => {
                        const userEntriesCopy = { ...userEntries }
                        userEntriesCopy.author = event.target.value
                        setUserEntries(userEntriesCopy)
                    }}
                >
                    <option value="0"> Choose to filter... </option>
                    {
                        authors.map(author => {
                            return <option key={author.id} value={author.id}>{author.author}</option>
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
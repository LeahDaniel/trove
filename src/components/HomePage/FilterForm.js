import { useState, useEffect } from "react"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"

export const FilterForm = ({ userEntries, setUserEntries }) => {
    const [tags, setTags] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))


    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(setTags)
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
            <FormGroup floating>
                <Input
                    id="titleSearch"
                    type="search"
                    placeholder="Search by Title"
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
                tags.map(tag => {
                    return <FormGroup key={`tag--${tag.id}`} check inline>
                        <Input
                            className="tagCheckbox"
                            type="checkbox"
                            checked={userEntries.tags.has(tag.id) ? true : false}
                            onChange={() => setTag(tag.id)}
                        />
                        {' '}
                        <Label check>
                            {tag.tag}
                        </Label>
                    </FormGroup>
                })
            }
        </Form>
    )
}
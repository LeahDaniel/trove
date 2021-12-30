import React, { useEffect, useState } from 'react';
import { Button, Card, FormGroup, Input, Label } from 'reactstrap';
import { TagRepo } from '../../repositories/TagRepo';
import { TagList } from './TagList';
import { TagSearch } from './TagSearch';

export const TagView = () => {
    const [userEntry, setUserEntry] = useState("")
    const [newTagString, setNewTagString] = useState("")
    const [openBoolean, setOpenBoolean] = useState(false)
    const [tags, setTags] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
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
                .then(() => setIsLoading(false))
        }, [userId]
    )

    useEffect(
        () => {
            if (userEntry === "") {
                TagRepo.getTagsForUser(userId)
                    .then(setTags)
            } else {
                TagRepo.getTagsForUserBySearchTerm(userId, userEntry)
                    .then(setTags)
            }

            if (userEntry !== "") {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }
        }, [userEntry, userId]
    )

    const constructTag = (enteredTag) => {
        const neutralizedTagsCopy = tags.map(tag => {
            const upperCased = tag.tag.toUpperCase()
            const noSpaces = upperCased.split(" ").join("")
            return {
                id: tag.id,
                tag: noSpaces
            }
        })

        const neutralizedEnteredTag = enteredTag.toUpperCase().split(" ").join("")
        let foundTag = neutralizedTagsCopy.find(tag => tag.tag === neutralizedEnteredTag)
        if (foundTag) {
            window.alert("Your list already contains this tag.")
        } else {
            //post a new tag object with that enteredTag
            TagRepo.addTag({
                tag: enteredTag,
                userId: userId,
            })
                //after doing PUT operation, update state
                .then(() => TagRepo.getTagsForUser(userId))
                .then(setTags)
                .then(() => setOpenBoolean(!openBoolean))
        }

    }

    return (

        <div className="p-5 m-5 bg-light">
            <TagSearch setUserEntry={setUserEntry} userEntry={userEntry} />
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <TagList tags={tags} setTags={setTags} userAttemptedSearch={userAttemptedSearch} setUserEntry={setUserEntry} />
            }
            <div className='row justify-content-center'>
                {
                    openBoolean
                        ? <FormGroup className="col-10 mt-4">
                            <Label>New Tag Name</Label>
                            <Input
                                id="tagEdit"
                                type="text"
                                placeholder="Press Enter to submit..."
                                onKeyUp={(event) => {
                                    if (event.key === "Enter") {
                                        constructTag(newTagString)
                                    } else {
                                        setNewTagString(event.target.value)
                                    }
                                }}
                            />
                        </FormGroup>
                        : <Button className="col-4 mt-4" onClick={() => setOpenBoolean(!openBoolean)}>Add A New Tag</Button>
                }

            </div>
        </div>

    )
}

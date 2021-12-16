import React, { useEffect, useState } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { TagRepo } from '../../repositories/TagRepo';
import { TagList } from './TagList';
import { TagSearch } from './TagSearch';

export const TagView = () => {
    const [userEntry, setUserEntry] = useState("")
    const [newTagString, setNewTagString] = useState("")
    const [openBoolean, setOpenBoolean] = useState(false)
    const [tags, setTags] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userEntry, userId]
    )

    return (
        <>
            <div className="p-5 m-5 bg-light">
                <TagSearch setUserEntry={setUserEntry} userEntry={userEntry} />
                <TagList tags={tags} setTags={setTags} userAttemptedSearch={userAttemptedSearch} setUserEntry={setUserEntry} />
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
                                            TagRepo.addTag({
                                                tag: newTagString,
                                                userId: userId,
                                            })
                                                //after doing PUT operation, update state
                                                .then(() => TagRepo.getTagsForUser(userId))
                                                .then(setTags)
                                                .then(() => setOpenBoolean(!openBoolean))
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
        </>
    )
}

import React, { useEffect, useState } from 'react';
import { Button, Card, FormGroup, Input, Label } from 'reactstrap';
import { sortByTag } from '../../repositories/FetchAndSort';
import { TagRepo } from '../../repositories/TagRepo';
import { TagList } from './TagList';
import { TagSearch } from './TagSearch';

export const TagView = () => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [userEntry, setUserEntry] = useState("")
    const [newTagString, setNewTagString] = useState("")
    const [tags, setTags] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [openBoolean, setOpenBoolean] = useState(false)

    useEffect(
        () => {
            if (userEntry === "") {
                TagRepo.getTagsForUser(userId)
                    .then(result => {
                        setTags(sortByTag(result))
                    })
                    .then(() => setIsLoading(false))
            } else {
                TagRepo.getTagsForUserBySearchTerm(userId, userEntry)
                    .then(result => {
                        setTags(sortByTag(result))
                    })
                    .then(() => setIsLoading(false))
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

        <div className="p-5 m-5 border gradient rounded">
            <div className='row justify-content-center mb-3'>
                <TagSearch setUserEntry={setUserEntry} userEntry={userEntry} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <TagList tags={tags} setTags={setTags} userAttemptedSearch={userAttemptedSearch} setUserEntry={setUserEntry} />
            }
            <div className='row justify-content-center'>
                {
                    openBoolean
                        ? <FormGroup className="col-5 mt-4">
                            <Label>New Tag Name</Label>
                            <Input
                                id="tagEdit"
                                type="text"
                                onKeyUp={(event) => {
                                    if (event.key === "Enter") {
                                        constructTag(newTagString)
                                    } else {
                                        setNewTagString(event.target.value)
                                    }
                                }}
                            />
                            <div className='row justify-content-center'>
                                <Button color="info" className="col-2 mt-4 px-1" onClick={() => constructTag(newTagString)}>Submit</Button>
                            </div>
                        </FormGroup>

                        : <Button color="info" className="col-lg-2 col-md-3 col-sm-4 col-xs-5 mt-4 px-1 " onClick={() => setOpenBoolean(!openBoolean)}>Add A New Tag</Button>
                }
            </div>
        </div>

    )
}

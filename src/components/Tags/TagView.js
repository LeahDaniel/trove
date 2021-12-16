import React, { useEffect, useState } from 'react';
import { TagRepo } from '../../repositories/TagRepo';
import { TagList } from './TagList';
import { TagSearch } from './TagSearch';

export const TagView = () => {
    const [userEntry, setUserEntry] = useState("")
    const [tags, setTags] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const userId = parseInt(localStorage.getItem("trove_user"))

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(setTags)
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
            <div className="p-5 m-5 bg-light border">
                <TagSearch setUserEntry={setUserEntry} />
                <TagList tags={tags} setTags={setTags} userAttemptedSearch={userAttemptedSearch} userEntry={userEntry}/>
            </div>
        </>
    )
}

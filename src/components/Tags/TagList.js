import React from "react"
import { useEffect, useState } from "react/cjs/react.development"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Tag } from "./Tag"

export const TagList = ({tags, userAttemptedSearch }) => {
    const [tagList, setTagList] = useState([])

    useEffect(
        () => {
            setTagList(tags)
        }, [tags]
    )

    return (
        <>
            {
                tags.length > 0
                    ? <div className="col-7 px-3 ps-5" >
                        {
                            tagList.map(tag => <Tag key={tag.id} tag={tag} setTagList={setTagList} />)
                        }
                    </div>
                    : <Card
                        body
                        className="col-7 px-3 ps-5 border-0"
                    >
                        <CardBody className="d-flex align-items-center justify-content-center">
                            <CardTitle tag="h5" className="text-center text-muted">
                                {
                                    userAttemptedSearch
                                        ? "No Results Found"
                                        : "Your list is empty. Add an item with the plus (+) button."
                                }
                            </CardTitle>
                        </CardBody>
                    </Card>

            }
            {/* Full list of tag cards. Pass state of tag and the setter function to the individual tag card component */}

        </>
    )
}
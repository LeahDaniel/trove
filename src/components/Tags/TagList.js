import React from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Tag } from "./Tag"

export const TagList = ({tags, setTags, userAttemptedSearch, setUserEntry }) => {
    return (
        <>
            {
                tags?.length > 0
                    ? <div className=" ps-3 mt-4 w-100 row" >
                        {
                            tags.map(tag => <Tag key={tag.id} tag={tag} setTags={setTags} setUserEntry={setUserEntry}/>)
                        }
                    </div>
                    : <Card
                        body
                        className="row justify-content-center"
                    >
                        <CardBody className="col-12">
                            <CardTitle tag="h5" className="text-center text-muted ">
                                {
                                    userAttemptedSearch
                                        ? "No Results Found"
                                        : "Your list is empty. Add an item with the button below."
                                }
                            </CardTitle>
                        </CardBody>
                    </Card>

            }
            {/* Full list of tag cards. Pass state of tag and the setter function to the individual tag card component */}

        </>
    )
}
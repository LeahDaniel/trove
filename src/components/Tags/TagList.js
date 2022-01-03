import React from "react"
import { Card, CardBody, CardTitle, Container, Row } from "reactstrap"
import { Tag } from "./Tag"

export const TagList = ({tags, setTags, userAttemptedSearch, setUserEntry }) => {
    return (
        <Container>
            {
                tags?.length > 0
                    ? <div className="d-inline-flex flex-row flex-wrap">
                        {
                            tags.map(tag => <Tag key={tag.id} tag={tag} setTags={setTags} setUserEntry={setUserEntry}/>)
                        }
                    </div>
                    : <Card
                        body
                        className="rounded"
                    >
                        <CardBody>
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
        </Container>
    )
}

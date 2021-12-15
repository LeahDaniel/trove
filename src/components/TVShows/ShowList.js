import React from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Show } from "./Show"

export const ShowList = ({ setShows, shows }) => {
    return (
        <>
            {
                shows.length > 0
                    ? <div className="col-7 px-3 ps-5" >
                        {
                            shows.map(show => <Show key={show.id} show={show} setShows={setShows} />)
                        }
                    </div>
                    : <Card
                        body
                        className="col-7 px-3 ps-5 border-0"
                    >
                        <CardBody className="d-flex align-items-center">
                            <CardTitle tag="h2" className="d-flex align-items-center">
                                No Results Found
                            </CardTitle>
                        </CardBody>
                    </Card>

            }
            {/* Full list of show cards. Pass state of show and the setter function to the individual show card component */}

        </>
    )
}
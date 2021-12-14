import React from "react"
import { Card } from "reactstrap"
import { Show } from "./Show"

export const ShowList = ({ setShows, shows }) => {
    return (
        <>
            {
                shows.length > 0
                    ? <div className="mx-4">
                        {
                            shows.map(show => <Show key={show.id} show={show} setShows={setShows} />)
                        }
                    </div>
                    : <Card>No search results found</Card>

            }
            {/* Full list of show cards. Pass state of show and the setter function to the individual show card component */}

        </>
    )
}
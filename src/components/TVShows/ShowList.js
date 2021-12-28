import React from "react"
import { Show } from "./Show"

export const ShowList = ({ setShows, shows, userAttemptedSearch }) => {
    return (
        <>
            {
                shows.length > 0
                    ? <div className="col-7 mt-4" >
                        {
                            shows.map(show => <Show key={show.id} show={show} setShows={setShows} />)
                        }
                    </div>
                    : <div
                        className="col-7 mt-4 border-0 d-flex align-items-center justify-content-center"
                    >
                        <h5 className="text-center text-muted">
                            {
                                userAttemptedSearch
                                    ? "No Results Found"
                                    : "Your list is empty. Add an item with the plus (+) button."
                            }
                        </h5>
                    </div>

            }
            {/* Full list of show cards. Pass state of show and the setter function to the individual show card component */}

        </>
    )
}
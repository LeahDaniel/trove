import React from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Book } from "./Book"

export const BookList = ({ setBooks, books, userAttemptedSearch }) => {
    return (
        <>
            {
                books.length > 0
                    ? <div className="col-7 px-3 ps-5" >
                        {
                            books.map(book => <Book key={book.id} book={book} setBooks={setBooks} />)
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
            {/* Full list of book cards. Pass state of book and the setter function to the individual book card component */}

        </>
    )
}
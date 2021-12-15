import React from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Book } from "./Book"

export const BookList = ({ setBooks, books }) => {
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
                        <CardBody className="d-flex align-items-center">
                            <CardTitle tag="h2" className="d-flex align-items-center">
                                No Results Found
                            </CardTitle>
                        </CardBody>
                    </Card>

            }
            {/* Full list of book cards. Pass state of book and the setter function to the individual book card component */}

        </>
    )
}
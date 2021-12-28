import React from "react"
import { Book } from "./Book"

export const BookList = ({ setBooks, books, userAttemptedSearch }) => {
    return (
        <>
            {
                books.length > 0
                    ? <div className="col-7 mt-4" >
                        {
                            books.map(book => <Book key={book.id} book={book} setBooks={setBooks} />)
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
            {/* Full list of book cards. Pass state of book and the setter function to the individual book card component */}

        </>
    )
}
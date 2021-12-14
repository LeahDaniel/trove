import React from "react"
import { Card } from "reactstrap"
import { Book } from "./Book"

export const BookList = ({ setBooks, books }) => {
    return (
        <>
            {
                books.length > 0
                    ? <div className="mx-4">
                        {
                            books.map(book => <Book key={book.id} book={book} setBooks={setBooks} />)
                        }
                    </div>
                    : <Card>No search results found</Card>

            }
            {/* Full list of book cards. Pass state of book and the setter function to the individual book card component */}

        </>
    )
}
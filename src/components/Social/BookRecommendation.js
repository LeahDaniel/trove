import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import { useHistory } from "react-router";
import { SocialRepo } from "../../repositories/SocialRepo";


export const BookRecommendation = ({ bookRecommendation, setBookRecommendations }) => {
    const history = useHistory()
    const [authors, setAuthors] = useState([])
    const [book, setBook] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(
        () => {
            BookRepo.get(bookRecommendation.bookId)
            .then(setBook)
            .then(BookRepo.getAllAuthors)
            .then(setAuthors)
            .then(() => setIsLoading(false))
        }, [bookRecommendation]
    )

    //delete recommendation by id. If a current book, set books with current books, else set books with queued books (to update state appropriately based on current user view)
    const deleteRecommendation = (id) => {
        SocialRepo.deleteBookRecommendation(id)
            .then(SocialRepo.getAllBookRecommendations)
            .then(setBookRecommendations)
    }

    return (
        <div className="mt-4">
            {
                isLoading
                ? ""
                :<Card
                body
                color="light"
                className="rounded shadow border-0"
            >
                <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                    {/* onClick of delete button (trash icon) call deleteRecommendation function with argument of the id of the present book. */}
                    <button className="imgButton">
                        <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                            () => { return deleteRecommendation(bookRecommendation.id) }
                        } />
                    </button>
                </div>

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className="mb-3 mt-0">
                        {/* display recommendation names */}
                        {book.name}
                    </CardTitle>
                    <CardSubtitle className="mb-3 mt-0">
                        {/* display sender name */}
                        <em>Recommended by {bookRecommendation.sender.name}</em>
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* display message (books as empty string if not entered on modal) */}
                        {bookRecommendation.message}
                    </CardText>

                    <Button color="info" className="text-white" onClick={() => {
                        history.push({
                            pathname: "/books/create",
                            state: {
                                name: book.name,
                                current: false,
                                author: authors.find(author => book.authorId === author.id),
                                tagArray: book.taggedBooks.map(taggedBook => taggedBook.tag.tag)
                            }
                        })
                    }}> Add to Queue </Button>

                </CardBody>
            </Card>
            }
        </div>
    )
}
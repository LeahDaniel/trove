import React, { useEffect, useState } from "react"
import { Badge, Card, CardBody, CardSubtitle, CardText, CardTitle, UncontrolledAlert } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import moveIcon from '../../images/MoveFolder3.png';
import sendIcon from '../../images/SendIcon.png';
import { useHistory } from "react-router";
import { RecommendationModal } from "../Social/RecommendationModal";


export const Book = ({ book, setBooks }) => {
    const history = useHistory()
    const [presentBook, setBook] = useState([])
    const [recommendationOpenBoolean, setRecommendationOpenBoolean] = useState(false)
    const [successOpenBoolean, setSuccessOpenBoolean] = useState(false)

    //any time the book prop's id state changes (on page load) get individual book with expanded user, embedded taggedBooks (with embedded tags), and embedded bookPlatforms (with embedded platforms)
    useEffect(() => {
        let mounted = true

        BookRepo.get(book.id)
            .then((result) => {
                if (mounted) {
                    setBook(result)
                }
            })

        return () => {
            mounted = false
        }
    }, [book.id])

    //delete book by id. If a current book, set books with current books, else set books with queued books (to update state appropriately based on current user view)
    const deleteBook = (bookId) => {
        if (presentBook.current === true) {
            BookRepo.delete(bookId)
                .then(() => BookRepo.getAll(true)
                    .then(setBooks))
        } else {
            BookRepo.delete(bookId)
                .then(() => BookRepo.getAll(false)
                    .then(setBooks))
        }
    }

    //PUT operation to modify a book from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        BookRepo.modifyBook({
            name: presentBook.name,
            userId: presentBook.userId,
            current: true,
            authorId: presentBook.authorId
        }, presentBook.id)
            //after doing PUT operation, push user to the current list, where the book is now located
            .then(() => history.push("/books/current"))
    }

    return (
        <div className="mt-4">

            {/*
                Modal that pops up on send button click
            */}
            <RecommendationModal openBoolean={recommendationOpenBoolean} setOpenBoolean={setRecommendationOpenBoolean}
                presentBook={presentBook} setBookRecoSuccess={setSuccessOpenBoolean} />

            <Card
                body
                color="light"
            >
                {
                    setBooks
                        ?
                        <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                            {/* 
                                If the present book is in the queue, display a "Add to Current" button.
                            */}
                            {
                                presentBook.current === false
                                    ? <button className="imgButton">
                                        <img src={moveIcon} alt="Move to Current" style={{ maxWidth: 40, maxHeight: 40 }} onClick={addToCurrent} />
                                    </button>
                                    : ""
                            }
                            {/* onClick of the edit button, push user to form route, and send along state of the presentBook to the location */}
                            <button className="imgButton">
                                <img src={editIcon} alt="Edit" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => {
                                        history.push({
                                            pathname: "/books/create",
                                            state: presentBook
                                        })
                                    }
                                } />
                            </button>
                            <button className="imgButton">
                                <img src={sendIcon} alt="Send" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => {
                                        setRecommendationOpenBoolean(true)
                                    }
                                } />
                            </button>
                            {/* onClick of delete button (trash icon) call deleteBook function with argument of the id of the present book. */}
                            <button className="imgButton">
                                <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={() => deleteBook(presentBook.id)} />
                            </button>

                        </div>
                        : ""
                }

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className={setBooks ? "mb-3 mt-0" : "my-3 pt-3"}>
                        {/* display book names */}
                        {presentBook.name}
                    </CardTitle>
                    <CardSubtitle className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        Written by {
                            presentBook.author?.name
                        }
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* map through the taggedBooks for the present book, and display the tag associated with each in a Badge format */}
                        {
                            presentBook.taggedBooks?.map(taggedBook => {
                                return <Badge className="my-1 me-1" key={taggedBook.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedBook.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>

                </CardBody>
            </Card>
            {
                successOpenBoolean
                    ? <UncontrolledAlert
                        color="success">
                        Recommendation sent!
                    </UncontrolledAlert>
                    : ""
            }
        </div>

    )
}
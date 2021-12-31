import { useEffect, useState } from "react/cjs/react.development"
import { BookList } from "./BookList"
import { SearchBooks } from "./SearchBooks"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { BookRepo } from "../../repositories/BookRepo";
import { Button, Card } from "reactstrap";
import { TagRepo } from "../../repositories/TagRepo";

export const BookQueueView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        author: "0",
        tags: new Set()
    })
    const history = useHistory()
    const [books, setBooks] = useState([])
    const [taggedBooks, setTaggedBooks] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)

    useEffect(
        () => {
            BookRepo.getAllQueue()
                .then(setBooks)
                .then(() => {
                    setLoading(false);
                })
                .then(() => TagRepo.getTaggedBooks())
                .then(result => {
                    const onlyQueued = result.filter(taggedBook => taggedBook.book?.current === false)
                    setTaggedBooks(onlyQueued)
                })
        }, []
    )

    useEffect(
        () => {
            const determineFilters = (midFilterBooks) => {
                const authorExist = userEntries.author !== "0"
                const noAuthor = userEntries.author === "0"
                const tagsExist = userEntries.tags.size > 0
                const noTags = userEntries.tags.size === 0

                const authorId = parseInt(userEntries.author)

                const booksByTagOnly = () => {
                    let newBookArray = []

                    for (const book of midFilterBooks) {
                        let booleanArray = []
                        userEntries.tags.forEach(tagId => {
                            const foundBook = book.taggedBooks?.find(taggedBook => taggedBook.tagId === tagId)
                            if (foundBook) {
                                booleanArray.push(true)
                            } else {
                                booleanArray.push(false)
                            }
                        })
                        if (booleanArray.every(boolean => boolean === true)) {
                            newBookArray.push(book)
                        }
                    }
                    return newBookArray
                }
                const booksByAuthorOnly = midFilterBooks.filter(book => book.authorId === authorId)
                const booksByTagAndAuthor = booksByTagOnly().filter(book => booksByAuthorOnly.includes(book))

                if (noAuthor && noTags) {
                    return midFilterBooks
                } else if (authorExist && noTags) {
                    return booksByAuthorOnly
                    //if a user has not been chosen and the favorites box is checked
                } else if (noAuthor && tagsExist) {
                    return booksByTagOnly()
                    //if a user has been chosen AND the favorites box is checked.
                } else if (authorExist && tagsExist) {
                    return booksByTagAndAuthor
                }
            }

            if (userEntries.name === "") {
                BookRepo.getAllQueue()
                    .then((result) => setBooks(determineFilters(result)))
            } else {
                BookRepo.getAllQueueBySearchTerm(userEntries.name)
                    .then((result) => setBooks(determineFilters(result)))
            }

            if (userEntries.name !== "" || userEntries.author !== "0" || userEntries.tags.size > 0) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

        }, [userEntries]
    )

    return (
        <div className="row justify-content-evenly">
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button className="col-6" onClick={
                        () => history.push("/books/create")
                    }>
                        <img src={addIcon} alt="Add" style={{ maxWidth: 25 }} className="me-2"
                        />
                        Add Book
                    </Button>
                </div>

                <SearchBooks setUserEntries={setUserEntries} userEntries={userEntries} taggedBooks={taggedBooks} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <BookList books={books} setBooks={setBooks} userAttemptedSearch={userAttemptedSearch} />
            }
        </div>
    )
}
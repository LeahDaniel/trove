import { useEffect, useState } from "react/cjs/react.development"
import { BookList } from "./BookList"
import { SearchBooks } from "./SearchBooks"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { BookRepo } from "../../repositories/BookRepo";
import { Card, Spinner } from "reactstrap";

export const BookQueueView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        author: "0",
        tag: "0"
    })
    const history = useHistory()
    const [books, setBooks] = useState([])
    const [midFilterBooks, setFilteredBooks] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)


    useEffect(
        () => {
            BookRepo.getAllQueue()
                .then(setBooks)
                .then(() => {
                    setLoading(false);
                })
        }, []
    )

    useEffect(
        () => {
            setBooks(determineFilters())
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [midFilterBooks]
    )

    useEffect(
        () => {
            if (userEntries.name === "") {
                BookRepo.getAllQueue()
                    .then(setFilteredBooks)
            } else {
                BookRepo.getAllQueueBySearchTerm(userEntries.name)
                    .then(setFilteredBooks)
            }

            if (userEntries.name !== "" || userEntries.author !== "0" || userEntries.tag !== "0") {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userEntries]
    )


    const determineFilters = () => {
        const authorExist = userEntries.author !== "0"
        const noAuthor = userEntries.author === "0"
        const tagExist = userEntries.tag !== "0"
        const noTag = userEntries.tag === "0"

        const authorId = parseInt(userEntries.author)
        const tagId = parseInt(userEntries.tag)

        const booksByTagOnly = midFilterBooks.filter(book => {
            const foundTaggedBook = book.taggedBooks?.find(taggedBook => taggedBook.tagId === tagId)
            if (foundTaggedBook) {
                return true
            } else {
                return false
            }
        })
        const booksByAuthorOnly = midFilterBooks.filter(book => book.authorId === authorId)
        const booksByTagAndAuthor = booksByTagOnly.filter(book => booksByAuthorOnly.includes(book))

        if (noAuthor && noTag) {
            return midFilterBooks
        } else if (authorExist && noTag) {
            return booksByAuthorOnly
            //if a user has not been chosen and the favorites box is checked
        } else if (noAuthor && tagExist) {
            return booksByTagOnly
            //if a user has been chosen AND the favorites box is checked.
        } else if (authorExist && tagExist) {
            return booksByTagAndAuthor
        }
    }

    return (
        <div className="row">
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0"/>
                    : <BookList books={books} setBooks={setBooks} userAttemptedSearch={userAttemptedSearch} />
            }
            <div className="col-5 px-3 pe-5">
                {/* clickable "add" image to bring user to form */}
                <div className="row">
                    <div className="col-8"></div>
                    <div className="col-4 pt-5">
                        <img src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                            onClick={
                                () => history.push("/books/create")
                            } />
                    </div>

                </div>
                <SearchBooks setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
        </div>
    )
}
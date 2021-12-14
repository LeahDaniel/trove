import { useEffect, useState } from "react/cjs/react.development"
import { BookList } from "./BookList"
import { SearchBooks } from "./SearchBooks"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { BookRepo } from "../../repositories/BookRepo";

export const CurrentBooksView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        author: "0",
        tag: "0"
    })
    const history = useHistory()
    const [books, setBooks] = useState([])
    const [midFilterBooks, setFilteredBooks] = useState([])


    useEffect(
        () => {
            BookRepo.getAllCurrent()
                .then(setBooks)
        }, []
    )

    useEffect(
        () => {
            setBooks(determineFilters())
        }, [midFilterBooks]
    )

    useEffect(
        () => {
            if (userEntries.name === "") {
                BookRepo.getAllCurrent()
                    .then(setFilteredBooks)
            } else {
                BookRepo.getAllCurrentBySearchTerm(userEntries.name)
                    .then(setFilteredBooks)
            }
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
        const booksByAuthorOnly = midFilterBooks.filter(book => book.streamingAuthorId === authorId)
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
        <div className="d-flex flex-row flex-wrap">
            <BookList books={books} setBooks={setBooks} />
            <div>
                {/* clickable "add" image to bring user to form */}
                <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                    onClick={
                        () => history.push("/books/create")
                    } />
                <SearchBooks setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
        </div>
    )
}
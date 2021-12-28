import { useEffect, useState } from "react/cjs/react.development"
import { BookList } from "./BookList"
import { SearchBooks } from "./SearchBooks"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { BookRepo } from "../../repositories/BookRepo";
import { Card} from "reactstrap";
import { TagRepo } from "../../repositories/TagRepo";

export const CurrentBooksView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        author: "0",
        tags: new Set()
    })
    const history = useHistory()
    const [books, setBooks] = useState([])
    const [taggedBooks, setTaggedBooks] = useState([])
    const [midFilterBooks, setFilteredBooks] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)


    useEffect(
        () => {
            BookRepo.getAllCurrent()
                .then(setBooks)
                .then(() => {
                    setLoading(false);
                })
                .then(() => TagRepo.getTaggedBooks())
                .then(result => {
                    const onlyCurrent = result.filter(taggedBook => taggedBook.book?.current === true)
                    setTaggedBooks(onlyCurrent)
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
                BookRepo.getAllCurrent()
                    .then(setFilteredBooks)
            } else {
                BookRepo.getAllCurrentBySearchTerm(userEntries.name)
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
                <SearchBooks setUserEntries={setUserEntries} userEntries={userEntries} taggedBooks={taggedBooks}/>
            </div>
        </div>
    )
}
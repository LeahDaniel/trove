import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label, UncontrolledAlert } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'

export const BookForm = () => {

    const history = useHistory()
    const presentBook = useLocation().state
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [authors, setAuthors] = useState([])
    const [tags, setTags] = useState([])
    //initialize object to hold user choices from form, and/or location.state (on edit of book)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        author: "",
        tagArray: []
    })
    //initialize object to control "invalid" prop on inputs
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        author: true,
    })
    //initialize boolean to indicate whether the user is on their first form attempt (prevent form warnings on first attempt)
    const [firstAttempt, setFirstAttempt] = useState(true)
    const [alert, setAlert] = useState(false)

    useEffect(
        () => {
            //on page load, GET streaming services and tags
            TagRepo.getTagsForUser(userId)
                .then(result => {
                    const sorted = result.sort((a, b) => {
                        const tagA = a.tag.toLowerCase()
                        const tagB = b.tag.toLowerCase()
                        if (tagA < tagB) { return -1 }
                        if (tagA > tagB) { return 1 }
                        return 0 //default return value (no sorting)
                    })
                    setTags(sorted)
                })
                .then(() => BookRepo.getAuthorsForUser(userId))
                .then(result => {
                    const sorted = result.sort((a, b) => {
                        const nameA = a.name.toLowerCase()
                        const nameB = b.name.toLowerCase()
                        if (nameA < nameB) { return -1 }
                        if (nameA > nameB) { return 1 }
                        return 0 //default return value (no sorting)
                    })
                    setAuthors(sorted)
                })
                //setInvalid on page load to account for pre-populated fields on edit.
                .then(checkValidity)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )
    useEffect(
        () => {
            if (presentBook) {
                //on presentBook state change (when user clicks edit to be brought to form)
                //setUserChoices from the values of the presentBook object
                userChoicesForPresentBook()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [presentBook]
    )
    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            checkValidity()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userChoices]
    )


    //setUserChoices from the values of the presentBook object
    const userChoicesForPresentBook = () => {
        //make copy of userChoices
        const copy = { ...userChoices }

        //change name, current, and multiplayer values based on presentBook values
        copy.name = presentBook.name
        copy.current = presentBook.current
        copy.author = presentBook.author.name

        //create a tag array from the presentBook's associated taggedBooks, and set as userChoices.tagArray value
        if (presentBook.taggedBooks) {
            let tagArray = []
            for (const taggedBook of presentBook.taggedBooks) {
                tagArray.push({ label: taggedBook.tag.tag, value: taggedBook.tag.id })
            }
            copy.tagArray = tagArray
        }

        //set user choices using the copy constructed above
        setUserChoices(copy)
    }

    //Deletes present taggedBooks and bookPlatforms for presentBook being edited. 
    // Then, PUT operation to books based on userChoices.
    //Then, POST operations to tags, taggedBooks, and bookPlatforms using the 
    //constructTags and constructBookPlatforms functions, with the edited book's id as an argument
    //Then, push user to current or queued based on if current on book is true or false
    const editBook = (newAuthorId) => {
        const bookFromUserChoices = {
            name: userChoices.name,
            userId: userId,
            current: userChoices.current,
            authorId: newAuthorId
        }

        TagRepo.deleteTaggedBooksForOneBook(presentBook)
            .then(() => BookRepo.modifyBook(bookFromUserChoices, presentBook.id))
            .then((addedBook) => {
                constructTags(addedBook)
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/books/current")
                } else {
                    history.push("/books/queue")
                }
            })
    }

    //POST operation to books
    //Then, POST operations to tags, taggedBooks, and bookPlatforms using the 
    //constructTags and constructBookPlatforms functions, with the posted book's id as an argument
    //Then, push user to current or queued based on if current on book is true or false
    const constructBook = (newAuthorId) => {
        const bookFromUserChoices = {
            name: userChoices.name,
            userId: userId,
            current: userChoices.current,
            authorId: newAuthorId
        }

        BookRepo.addBook(bookFromUserChoices)
            .then((addedBook) => {
                constructTags(addedBook)
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/books/current")
                } else {
                    history.push("/books/queue")
                }
            })
    }


    //uses the tagArray to POST to tags (if it does not yet exist), and to POST taggedBooks objects.
    //tags will be evaluated as the same even if capitalization and spaces are different.
    const constructTags = (addedBook) => {
        for (const enteredTag of userChoices.tagArray) {
            if (enteredTag.__isNew__) {
                //post a new tag object with that enteredTag
                TagRepo.addTag({ tag: enteredTag.value, userId: userId })
                    .then((newTag) => {
                        TagRepo.addTaggedBook({
                            tagId: newTag.id,
                            bookId: addedBook.id
                        })
                    })
                //post a new taggedBook object with the tag object made above
            } else {
                //post a new taggedBook object with that tag
                TagRepo.addTaggedBook({
                    tagId: parseInt(enteredTag.value),
                    bookId: addedBook.id
                })

            }
        }
    }

    const constructAuthor = (evt) => {
        evt.preventDefault()

        const neutralizedAuthorsCopy = authors.map(author => {
            const upperCased = author.name.toUpperCase()
            const noSpaces = upperCased.split(" ").join("")
            return {
                id: author.id,
                userId: author.userId,
                name: noSpaces
            }
        })

        const neutralizedEnteredAuthor = userChoices.author.toUpperCase().split(" ").join("")

        let foundAuthor = neutralizedAuthorsCopy.find(author => author.name === neutralizedEnteredAuthor)

        if (foundAuthor) {
            //set the state of the authorId using the id of the existing author object
            if (presentBook?.userId) {
                editBook(foundAuthor.id)
            } else {
                constructBook(foundAuthor.id)
            }

        } else {
            //post a new author object with the entered author name
            BookRepo.addAuthor({ name: userChoices.author, userId: userId })
                .then((newAuthor) => {
                    if (presentBook?.userId) {
                        editBook(newAuthor.id)
                    } else {
                        constructBook(newAuthor.id)
                    }
                })

        }
    }

    //use the userChoices values to set the invalid booleans (was the user entry a valid entry or not)
    const checkValidity = () => {
        const invalidCopy = { ...invalid }
        //name
        if (userChoices.name === "") {
            invalidCopy.name = true
        } else {
            invalidCopy.name = false
        }
        //multiplayer
        if (userChoices.author === "") {
            invalidCopy.author = true
        } else {
            invalidCopy.author = false
        }
        //current
        if (userChoices.current === null) {
            invalidCopy.current = true
        } else {
            invalidCopy.current = false
        }

        setInvalid(invalidCopy)
    }

    return (
        <div className="row justify-content-center">
            <Form className="m-4 p-2 col-9">
                {
                    presentBook
                        ? <h3> Edit a Book</h3>
                        : <h3> Add a New Book</h3>
                }
                <FormGroup className="mt-4">
                    <Label for="bookTitle">
                        Book Title
                    </Label>
                    <Input
                        id="bookTitle"
                        name="title"
                        //if this is not the first attempt at filling out the form, allow the 
                        //input to be marked as invalid (if the invalid state is true)
                        //Otherwise, do not mark field as invalid
                        invalid={!firstAttempt ? invalid.name : false}
                        //set value based on userChoices to allow form to pre-populate if user was pushed to form from edit button
                        //and so that the displayed entry changes as the user edits it (because of onChange)
                        value={userChoices.name}
                        //on change on field, set userChoices
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.name = event.target.value
                            setUserChoices(copy)
                        }}
                        className="mb-2"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Genre Tags</Label>
                    <CreatableSelect
                        isMulti
                        isClearable
                        value={userChoices.tagArray}
                        options={
                            tags.map(tag => ({ label: tag.tag, value: tag.id }))
                        }
                        onChange={optionChoices => {
                            const copy = { ...userChoices }
                            copy.tagArray = optionChoices
                            setUserChoices(copy)
                        }}
                        id="tagSelect"
                        placeholder="Select or create tags..."
                    />
                </FormGroup>
                {
                    presentBook?.tagArray?.length > 0
                    ? <UncontrolledAlert fade color="info">The user who recommended this used the tag(s): {presentBook.tagArray.join(", ")}</UncontrolledAlert>
                    : ""
                }
                <FormGroup>
                    <Label for="exampleSelect">
                        Author
                    </Label>
                    <Input
                        id="bookTags"
                        type="text"
                        invalid={!firstAttempt ? invalid.author : false}
                        value={userChoices.author}
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.author = event.target.value
                            setUserChoices(copy)
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleSelect">
                        Current or Queued?
                    </Label>
                    <Input
                        id="currentSelect"
                        type="select"
                        invalid={!firstAttempt ? invalid.current : false}
                        value={userChoices.current === null
                            ? "Choose an option..."
                            : userChoices.current === true
                                ? "Current"
                                : "Queued"
                        }
                        onChange={(event) => {
                            const copy = { ...userChoices }

                            if (event.target.value === "Current") {
                                copy.current = true
                            } else if (event.target.value === "Queued") {
                                copy.current = false
                            } else {
                                copy.current = null
                            }
                            setUserChoices(copy)
                        }
                        }
                    >
                        <option>
                            Choose an option...
                        </option>
                        <option>
                            Current
                        </option>
                        <option>
                            Queued
                        </option>
                    </Input>
                    <FormText className="mb-2">
                        Have you started this book (current) or are you thinking of watching it in the future (queued)?
                    </FormText>
                </FormGroup>
                {
                    alert && presentBook
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields. If you have no edits, click "Cancel".
                            </Alert>
                        </div>
                        : alert && !presentBook
                            ? <div>
                                <Alert
                                    color="danger"
                                >
                                    Please complete all required (!) fields before submitting.
                                </Alert>
                            </div>
                            : ""
                }
                <FormGroup>
                    <Button onClick={(evt) => {
                        evt.preventDefault()

                        setFirstAttempt(false)

                        //check if every key on the "invalid" object is false
                        if (Object.keys(invalid).every(key => invalid[key] === false)) {
                            constructAuthor(evt)
                        } else {
                            setAlert(true)
                        }
                    }}>
                        Submit
                    </Button>
                    {presentBook
                        //if there is a presentBook object (user was pushed to form from edit button), allow them to go back to the previous page they were on (the appropriate list)
                        ? <Button onClick={() => { history.goBack() }} className="ms-3">
                            Cancel
                        </Button>
                        : ""
                    }
                </FormGroup>
            </Form >
        </div>
    )
}
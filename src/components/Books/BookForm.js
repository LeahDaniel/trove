import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label, UncontrolledAlert } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'
import { sortByName, sortByTag } from "../../repositories/FetchAndSort"

export const BookForm = () => {
    const history = useHistory()
    const presentBook = useLocation().state
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [authors, setAuthors] = useState([])
    const [tags, setTags] = useState([])
    const [firstAttempt, setFirstAttempt] = useState(true)
    const [alert, setAlert] = useState(false)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        author: "",
        tagArray: []
    })
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        author: true,
    })

    useEffect(
        () => {
            //on page load, GET streaming services and tags
            TagRepo.getTagsForUser(userId)
                .then(result => {
                    setTags(sortByTag(result))
                })
                .then(() => BookRepo.getAuthorsForUser(userId))
                .then(result => {
                    setAuthors(sortByName(result))
                })
                .then(() => {
                    if (presentBook) {
                        //on presentBook state change (when user clicks edit to be brought to form)
                        //setUserChoices from the values of the presentBook object

                        //change name, current, and multiplayer values based on presentBook values
                        const obj = {
                            name: presentBook.name,
                            current: presentBook.current,
                            author: presentBook.author.name,
                            tagArray: []
                        }

                        //create a tag array from the presentBook's associated taggedBooks, and set as userChoices.tagArray value
                        if (presentBook.taggedBooks) {
                            let tagArray = []
                            for (const taggedBook of presentBook.taggedBooks) {
                                tagArray.push({ label: taggedBook.tag.tag, value: taggedBook.tag.id })
                            }
                            obj.tagArray = tagArray
                        }

                        //set user choices using the copy constructed above
                        setUserChoices(obj)
                    }
                })
        }, [userId, presentBook]
    )

    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            //use the userChoices values to set the invalid booleans (was the user entry a valid entry or not)

            const obj = {
                name: false,
                author: false,
                current: false
            }

            //name
            if (userChoices.name === "") {
                obj.name = true
            }
            //multiplayer
            if (userChoices.author === "") {
                obj.author = true
            }
            //current
            if (userChoices.current === null) {
                obj.current = true
            }

            setInvalid(obj)
            window.history.replaceState(null, '')
        }, [userChoices]
    )

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
                if (userChoices.tagArray) {
                    constructTags(addedBook)
                }
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
                        ? <Alert color="success">The user who recommended this used the tag(s): {presentBook.tagArray.join(", ")}</Alert>
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
                    alert
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields.
                            </Alert>
                        </div>
                        : ""
                }
                <FormGroup>
                    <Button className="text-white" color="info" onClick={(evt) => {
                        evt.preventDefault()
                        // checkValidity()
                        setFirstAttempt(false)

                        if (Object.keys(invalid).every(key => invalid[key] === false)) {
                            constructAuthor(evt)
                        } else {
                            setAlert(true)
                        }


                        //check if every key on the "invalid" object is false

                    }}>
                        Submit
                    </Button>
                    <Button onClick={() => { history.goBack() }} color="info" className="ms-3 text-white">
                        Cancel
                    </Button>
                </FormGroup>
            </Form >
        </div>
    )
}
import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { TagRepo } from "../../repositories/TagRepo"

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
        tags: true
    })
    //initialize boolean to indicate whether the user is on their first form attempt (prevent form warnings on first attempt)
    const [firstAttempt, setFirstAttempt] = useState(true)

    useEffect(
        () => {
            //on page load, GET streaming services and tags
            TagRepo.getAll()
                .then(setTags)
                .then(() => BookRepo.getAuthorsForUser(userId))
                .then(setAuthors)
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
        let tagArray = []
        for (const taggedBook of presentBook.taggedBooks) {
            tagArray.push(taggedBook.tag.tag)
        }
        copy.tagArray = tagArray

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
            userId: parseInt(localStorage.getItem("trove_user")),
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
            userId: parseInt(localStorage.getItem("trove_user")),
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
        const neutralizedTagsCopy = tags.map(tag => {
            const upperCased = tag.tag.toUpperCase()
            const noSpaces = upperCased.split(" ").join("")
            return {
                id: tag.id,
                userId: tag.userId,
                tag: noSpaces
            }
        })


        for (const enteredTag of userChoices.tagArray) {
            const neutralizedEnteredTag = enteredTag.toUpperCase().split(" ").join("")
            let foundTag = neutralizedTagsCopy.find(tag => tag.tag === neutralizedEnteredTag && userId === tag.userId)
            if (foundTag) {
                //post a new taggedBook object with that tag
                TagRepo.addTaggedBook({
                    tagId: foundTag.id,
                    bookId: addedBook.id
                })
            } else {
                //post a new tag object with that enteredTag
                TagRepo.addTag({ tag: enteredTag, userId: userId })
                    .then((newTag) => {
                        TagRepo.addTaggedBook({
                            tagId: newTag.id,
                            bookId: addedBook.id
                        })
                    })

                //post a new taggedBook object with the tag object made above

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
            presentBook
                ? editBook(foundAuthor.id)
                : constructBook(foundAuthor.id)

        } else {
            //post a new author object with the entered author name
            BookRepo.addAuthor({ name: userChoices.author, userId: userId })
                .then((newAuthor) => {
                    presentBook
                        ? editBook(newAuthor.id)
                        : constructBook(newAuthor.id)
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
        //tags
        if (userChoices.tagArray.length === 0) {
            invalidCopy.tags = true
        } else {
            invalidCopy.tags = false
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
        <Form className="m-4 p-2">
            {
                presentBook
                    ? <h3> Edit a Book</h3>
                    : <h3> Add a New Book</h3>
            }
            <FormGroup className="mt-4" row>
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
            <FormGroup row>
                <Label
                    for="bookTags"
                >
                    Genre Tags
                </Label>
                <Input
                    id="bookTags"
                    type="textarea"
                    invalid={!firstAttempt ? invalid.tags : false}
                    value={userChoices.tagArray.join(", ")}
                    onChange={(event) => {
                        const copy = { ...userChoices }
                        copy.tagArray = event.target.value.split(", ")
                        setUserChoices(copy)
                    }}
                />
                <FormText className="mb-2">
                    Enter tag names, separated by commas and spaces. Ex: "horror, RPG, first-person shooter"
                </FormText>
            </FormGroup>
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
            <FormGroup>
                <Button onClick={(evt) => {
                    evt.preventDefault()

                    setFirstAttempt(false)

                    //check if every key on the "invalid" object is false
                    if (Object.keys(invalid).every(key => invalid[key] === false)) {
                        constructAuthor(evt)
                    }
                }}>
                    Submit
                </Button>
                {presentBook
                    //if there is a presentBook object (user was pushed to form from edit button), allow them to go back to the previous page they were on (the appropriate list)
                    ? <Button onClick={() => { history.goBack() }}>
                        Cancel
                    </Button>
                    : ""
                }


            </FormGroup>
        </Form >
    )
}
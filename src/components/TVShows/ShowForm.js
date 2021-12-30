import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label, UncontrolledAlert } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'

export const ShowForm = () => {
    const history = useHistory()
    const presentShow = useLocation().state
    const [streamingServices, setStreamingServices] = useState([])
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [tags, setTags] = useState([])
    //initialize object to hold user choices from form, and/or location.state (on edit of show)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        streamingService: 0,
        tagArray: []
    })
    //initialize object to control "invalid" prop on inputs
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        streaming: true,
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
                .then(ShowRepo.getAllStreamingServices)
                .then(setStreamingServices)
                .then(() => {
                    if (presentShow) {
                        //on presentShow state change (when user clicks edit to be brought to form)
                        //setUserChoices from the values of the presentShow object

                        //change name, current, and multiplayer values based on presentShow values
                        const obj = {
                            name: presentShow.name,
                            current: presentShow.current,
                            streamingService: presentShow.streamingServiceId
                        }

                        //create a tag array from the presentShow's associated taggedShows, and set as userChoices.tagArray value
                        if (presentShow.taggedShows) {
                            let tagArray = []
                            for (const taggedShow of presentShow.taggedShows) {
                                tagArray.push({ label: taggedShow.tag.tag, value: taggedShow.tag.id })
                            }
                            obj.tagArray = tagArray
                        }

                        //set user choices using the obj constructed above
                        setUserChoices(obj)

                    }
                })
        }, [userId, presentShow]
    )

    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            const obj = {
                name: false,
                streaming: false,
                current: false
            }
            //name
            if (userChoices.name === "") {
                obj.name = true
            }
            //multiplayer
            if (userChoices.streamingService === 0) {
                obj.streaming = true
            }
            //current
            if (userChoices.current === null) {
                obj.current = true
            }

            setInvalid(obj)
        }, [userChoices]
    )

    //Deletes present taggedShows and showPlatforms for presentShow being edited. 
    // Then, PUT operation to shows based on userChoices.
    //Then, POST operations to tags, taggedShows, and showPlatforms using the 
    //constructTags and constructShowPlatforms functions, with the edited show's id as an argument
    //Then, push user to current or queued based on if current on show is true or false
    const editShow = evt => {
        evt.preventDefault()

        const showFromUserChoices = {
            name: userChoices.name,
            userId: parseInt(localStorage.getItem("trove_user")),
            current: userChoices.current,
            streamingServiceId: userChoices.streamingService
        }


        TagRepo.deleteTaggedShowsForOneShow(presentShow)
            .then(() => ShowRepo.modifyShow(showFromUserChoices, presentShow.id))
            .then((addedShow) => {
                constructTags(addedShow)
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/shows/current")
                } else {
                    history.push("/shows/queue")
                }
            })
    }

    //POST operation to shows
    //Then, POST operations to tags, taggedShows, and showPlatforms using the 
    //constructTags and constructShowPlatforms functions, with the posted show's id as an argument
    //Then, push user to current or queued based on if current on show is true or false
    const constructShow = evt => {
        evt.preventDefault()

        const showFromUserChoices = {
            name: userChoices.name,
            userId: parseInt(localStorage.getItem("trove_user")),
            current: userChoices.current,
            streamingServiceId: userChoices.streamingService
        }

        ShowRepo.addShow(showFromUserChoices)
            .then((addedShow) => {
                if (userChoices.tagArray) {
                    constructTags(addedShow)
                }
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/shows/current")
                } else {
                    history.push("/shows/queue")
                }
            })
    }


    //uses the tagArray to POST to tags (if it does not yet exist), and to POST taggedShows objects.
    //tags will be evaluated as the same even if capitalization and spaces are different.
    const constructTags = (addedShow) => {
        for (const enteredTag of userChoices.tagArray) {
            if (enteredTag.__isNew__) {
                //post a new tag object with that enteredTag
                TagRepo.addTag({ tag: enteredTag.value, userId: userId })
                    .then((newTag) => {
                        TagRepo.addTaggedShow({
                            tagId: newTag.id,
                            showId: addedShow.id
                        })
                    })
                //post a new taggedShow object with the tag object made above
            } else {
                //post a new taggedShow object with that tag
                TagRepo.addTaggedShow({
                    tagId: parseInt(enteredTag.value),
                    showId: addedShow.id
                })

            }
        }
    }

    return (
        <div className="row justify-content-center">
            <Form className="m-4 p-2 col-9">
                {
                    presentShow
                        ? <h3> Edit a Show</h3>
                        : <h3> Add a New Show</h3>
                }
                <FormGroup className="mt-4">
                    <Label for="showTitle">
                        Show Title
                    </Label>
                    <Input
                        id="showTitle"
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
                    presentShow?.tagArray?.length > 0
                        ? <UncontrolledAlert fade color="info">The user who recommended this used the tags: {presentShow.tagArray.join(", ")}</UncontrolledAlert>
                        : ""
                }
                <FormGroup>
                    <Label for="exampleSelect">
                        Streaming Service
                    </Label>
                    <Input
                        id="currentSelect"
                        type="select"
                        invalid={!firstAttempt ? invalid.streaming : false}
                        value={userChoices.streamingService}
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.streamingService = parseInt(event.target.value)
                            setUserChoices(copy)
                        }}
                    >
                        <option value="0">
                            Choose an option...
                        </option>
                        {
                            streamingServices.map(service => {
                                return <option value={service.id} key={service.id}>
                                    {service.service}
                                </option>
                            })

                        }
                    </Input>
                    <FormText>
                        Select the service you are currently watching the show on.
                    </FormText>
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
                        Have you started this show (current) or are you thinking of watching it in the future (queued)?
                    </FormText>
                </FormGroup>
                {
                    alert && presentShow
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields. If you have no edits, click "Cancel".
                            </Alert>
                        </div>
                        : alert && !presentShow
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
                            if (presentShow?.userId) {
                                editShow(evt)
                            } else {
                                constructShow(evt)
                            }
                        } else {
                            setAlert(true)
                        }
                    }}>
                        Submit
                    </Button>
                    <Button onClick={() => { history.goBack() }} className="ms-3">
                        Cancel
                    </Button>
                </FormGroup>
            </Form >
        </div>
    )
}
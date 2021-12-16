import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
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


    useEffect(
        () => {
            //on page load, GET streaming services and tags
            TagRepo.getTagsForUser(userId)
                .then(setTags)
                .then(() => ShowRepo.getAllStreamingServices())
                .then(setStreamingServices)
                //setInvalid on page load to account for pre-populated fields on edit.
                .then(checkValidity)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )
    useEffect(
        () => {
            if (presentShow) {
                //on presentShow state change (when user clicks edit to be brought to form)
                //setUserChoices from the values of the presentShow object
                userChoicesForPresentShow()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [presentShow]
    )
    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            checkValidity()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userChoices]
    )


    //setUserChoices from the values of the presentShow object
    const userChoicesForPresentShow = () => {
        //make copy of userChoices
        const copy = { ...userChoices }

        //change name, current, and multiplayer values based on presentShow values
        copy.name = presentShow.name
        copy.current = presentShow.current
        copy.streamingService = presentShow.streamingServiceId

        //create a tag array from the presentShow's associated taggedShows, and set as userChoices.tagArray value
        let tagArray = []
        for (const taggedShow of presentShow.taggedShows) {
            tagArray.push({ label: taggedShow.tag.tag, value: taggedShow.tag.id })
        }
        copy.tagArray = tagArray

        //set user choices using the copy constructed above
        setUserChoices(copy)
    }

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
        if (userChoices.streamingService === 0) {
            invalidCopy.streaming = true
        } else {
            invalidCopy.streaming = false
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
                presentShow
                    ? <h3> Edit a Show</h3>
                    : <h3> Add a New Show</h3>
            }
            <FormGroup className="mt-4" row>
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
                    theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        color: "green",
                        colors: {
                            ...theme.colors,
                            primary: "#b90000",
                            primary25: "#c9cad0",
                            primary50: "#c9cad0"
                        }
                    })}
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
            <FormGroup>
                <Button onClick={(evt) => {
                    evt.preventDefault()

                    setFirstAttempt(false)

                    //check if every key on the "invalid" object is false
                    if (Object.keys(invalid).every(key => invalid[key] === false)) {
                        presentShow
                            ? editShow(evt)
                            : constructShow(evt)
                    }
                }}>
                    Submit
                </Button>
                {presentShow
                    //if there is a presentShow object (user was pushed to form from edit button), allow them to go back to the previous page they were on (the appropriate list)
                    ? <Button onClick={() => { history.goBack() }}>
                        Cancel
                    </Button>
                    : ""
                }


            </FormGroup>
        </Form >
    )
}
import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, Input, Tooltip } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"



export const Tag = ({ tag, setTags, setUserEntry }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [presentTag, setTag] = useState([])
    const [userEdit, setUserEdit] = useState("")
    const [openEditBox, setOpenEditBoolean] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    //any time the tag prop's id state changes (on page load) get individual tag with expanded user, embedded taggedTags (with embedded tags), and embedded tagPlatforms (with embedded platforms)
    useEffect(() => {
        TagRepo.get(tag.id)
            .then(setTag)
            .then(() => setUserEdit(tag.tag))
            .then(() => setIsLoading(false))
    }, [tag])


    useEffect(() => {
        // add when mounted
        document.addEventListener("click", handleClick)
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    const handleClick = e => {
        if (e.target.id === "tagEdit" || e.target.id === "title") {
            // inside click
            return
        }
        // outside click 
        setOpenEditBoolean(false)
        setTooltipOpen(false)
    }


    return (
        <>
            {
                isLoading
                    ? ""
                    : <Card className="rounded shadow-sm border-0 m-2 p-0">
                        {/* display tag names */}
                        {
                            openEditBox
                                ? <CardBody className="p-0 m-0">
                                    <Input
                                        autoFocus
                                        id="tagEdit"
                                        type="text"
                                        bsSize="sm"
                                        value={userEdit}
                                        style={{ fontSize: "16px" }}
                                        className="border-0 ps-2 py-2 pe-0 m-0 "
                                        onKeyUp={(event) => {
                                            if (event.key === "Enter") {
                                                TagRepo.editTag({
                                                    tag: userEdit,
                                                    userId: userId,
                                                }, presentTag.id)
                                                    //after doing PUT operation, update state
                                                    .then(() => TagRepo.get(tag.id))
                                                    .then(setTag)
                                                    .then(() => setTooltipOpen(false))
                                                    .then(setUserEntry(""))
                                                    .then(() => setOpenEditBoolean(!openEditBox))
                                            }
                                        }}
                                        onChange={(event) => setUserEdit(event.target.value)}
                                    />
                                    <Tooltip
                                        isOpen={tooltipOpen}
                                        placement="bottom"
                                        target="tagEdit"
                                        toggle={() => setTooltipOpen(!tooltipOpen)}>
                                        Press enter to submit
                                    </Tooltip>
                                </CardBody>
                                : <CardBody className="d-flex flex-row py-2 px-0 m-0 justify-content-evenly ">
                                    {/* onClick of delete button (trash icon) call deleteTag function with argument of the id of the present tag. */}
                                    < Button
                                        close
                                        className="close px-2 py-0 ms-1 me-0 align-self-center"
                                        style={{ maxWidth: 8, maxHeight: 12 }}
                                        onClick={
                                            () => {
                                                TagRepo.deleteTag(presentTag.id)
                                                    .then(() => TagRepo.getTagsForUser(userId))
                                                    .then(setTags)
                                            }
                                        } />
                                    <div
                                        onClick={() => setOpenEditBoolean(!openEditBox)}
                                        className="m-0 py-0 px-3 align-self-center"
                                        id="title"
                                    >
                                        {presentTag.tag}</div>
                                </CardBody>
                        }

                    </Card>
            }
        </>

    )
}
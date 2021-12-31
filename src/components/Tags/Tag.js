import React, { useEffect, useState } from "react"
import { Button, Card, CardTitle, FormGroup, Input, Tooltip } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"



export const Tag = ({ tag, setTags, setUserEntry }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [presentTag, setTag] = useState([])
    const [userEdit, setUserEdit] = useState("")
    const [openEditBox, setOpenEditBoolean] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)

    //any time the tag prop's id state changes (on page load) get individual tag with expanded user, embedded taggedTags (with embedded tags), and embedded tagPlatforms (with embedded platforms)
    useEffect(() => {
        TagRepo.get(tag.id)
            .then(setTag)
            .then(() => setUserEdit(tag.tag))
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
        <div className="col-sm-auto">
            <Card className="m-2 mw-100" style={{ borderRadius: 20 }}>
                {/* display tag names */}
                {/* onClick of delete button (trash icon) call deleteTag function with argument of the id of the present tag. */}
                <Button close className="ms-auto p-2" onClick={
                    () => {
                        TagRepo.deleteTag(presentTag.id)
                            .then(() => TagRepo.getTagsForUser(userId))
                            .then(setTags)
                    }
                } />

                <div className="mb-2 px-2">
                    {
                        openEditBox
                            ? <FormGroup className="col">
                                <Input
                                    autoFocus
                                    id="tagEdit"
                                    type="text"
                                    bsSize="sm"
                                    value={userEdit}
                                    style={{ fontSize: "20px", fontWeight: "500", maxWidth: 100}}
                                    className="border-0 d-inline-block text-truncate"
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
                            </FormGroup>
                            : <CardTitle onClick={
                                () => {
                                    setOpenEditBoolean(!openEditBox)
                                }
                            } tag="h5" className="d-inline-block text-truncate" id="title">{presentTag.tag}</CardTitle>
                    }
                </div>
            </Card>
        </div>

    )
}
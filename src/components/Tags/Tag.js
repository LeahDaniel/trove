import React, { useEffect, useState } from "react"
import { Card, CardBody, CardTitle, FormGroup, Input } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';


export const Tag = ({ tag, setTags, userEntry }) => {
    const [presentTag, setTag] = useState([])
    const [userEdit, setUserEdit] = useState("")
    const [openEditBox, setOpenEditBoolean] = useState(false)
    const userId = parseInt(localStorage.getItem("trove_user"))

    //any time the tag prop's id state changes (on page load) get individual tag with expanded user, embedded taggedTags (with embedded tags), and embedded tagPlatforms (with embedded platforms)
    useEffect(() => {
        TagRepo.get(tag.id)
            .then(setTag)
    }, [tag.id])

    //PUT operation to modify a tag from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        
    }

    return (
        <div className="mt-4">
            <Card
                body
                color="light"
            >
                <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                    {/* onClick of delete button (trash icon) call deleteTag function with argument of the id of the present tag. */}
                    <img className="me-3" src={deleteIcon} alt="Delete" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                        () => {
                            TagRepo.deleteTag(presentTag.id)
                                .then(TagRepo.getTagsForUser(userId))
                                .then(setTags)
                        }
                    } />
                    {/* onClick of the edit button, push user to form route, and send along state of the presentTag to the location */}
                    <img className="me-1" src={editIcon} alt="Edit" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                        () => {
                            setOpenEditBoolean(!openEditBox)
                        }
                    } />
                </div>


                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4">
                        {/* display tag names */}
                        {presentTag.tag}
                    </CardTitle>
                    {
                        openEditBox
                            ? <FormGroup >
                                <Input
                                    id="tagEdit"
                                    type="text"
                                    placeholder="Enter new tag..."
                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") {
                                            TagRepo.editTag({
                                                tag: userEdit,
                                                userId: userId,
                                            }, presentTag.id)
                                                //after doing PUT operation, update state
                                                .then(() => {
                                                    TagRepo.getTagsForUser(userId)
                                                })
                                                .then(setTags)
                                        } else {
                                            setUserEdit(event.target.value)
                                        }
                                    }}
                                />
                            </FormGroup>
                            : ""
                    }

                </CardBody>
            </Card>
        </div>

    )
}
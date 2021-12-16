import React, { useEffect, useState } from "react"
import {FormGroup, Input } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';


export const Tag = ({ tag, setTags, setUserEntry }) => {
    const [presentTag, setTag] = useState([])
    const [userEdit, setUserEdit] = useState("")
    const [openEditBox, setOpenEditBoolean] = useState(false)
    const userId = parseInt(localStorage.getItem("trove_user"))

    //any time the tag prop's id state changes (on page load) get individual tag with expanded user, embedded taggedTags (with embedded tags), and embedded tagPlatforms (with embedded platforms)
    useEffect(() => {
        TagRepo.get(tag.id)
            .then(setTag)
    }, [tag.id])


    return (
        <>

            {/* display tag names */}
            <div className="col-1 my-2">
                {/* onClick of the edit button, push user to form route, and send along state of the presentTag to the location */}
                <img className="ms-1" src={editIcon} alt="Edit" style={{ maxWidth: 20, maxHeight: 20 }} onClick={
                    () => {
                        setOpenEditBoolean(!openEditBox)
                    }
                } />
                {/* onClick of delete button (trash icon) call deleteTag function with argument of the id of the present tag. */}
                <img className="ms-1" src={deleteIcon} alt="Delete" style={{ maxWidth: 20, maxHeight: 20 }} onClick={
                    () => {
                        TagRepo.deleteTag(presentTag.id)
                            .then(() => TagRepo.getTagsForUser(userId))
                            .then(setTags)
                    }
                } />
            </div>
            <h5 className="col-5 pe-3 my-2">{presentTag.tag}</h5>

            {
                openEditBox
                    ? <FormGroup className="col-6 my-2 p-0">
                        <Input
                            id="tagEdit"
                            type="text"
                            bsSize="sm"
                            className="fs-6"
                            placeholder="Press enter to submit..."
                            onKeyUp={(event) => {
                                if (event.key === "Enter") {
                                    TagRepo.editTag({
                                        tag: userEdit,
                                        userId: userId,
                                    }, presentTag.id)
                                        //after doing PUT operation, update state
                                        .then(() => TagRepo.get(tag.id))
                                        .then(setTag)
                                        .then(() => setOpenEditBoolean(!openEditBox))
                                        .then(setUserEntry(""))
                                } else {
                                    setUserEdit(event.target.value)
                                }
                            }}
                        />
                    </FormGroup>
                    : <p className="col-6 my-2"></p>
            }

        </>

    )
}
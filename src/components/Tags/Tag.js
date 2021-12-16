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
        <>

            {/* display tag names */}
            <h5 className="col-4 pe-3 py-2 border-top">{presentTag.tag}</h5>

            {
                openEditBox
                    ? <FormGroup className="col-6 border-top py-2">
                        <Input
                            id="tagEdit"
                            type="text"
                            placeholder="Press Enter to submit..."
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
                                } else {
                                    setUserEdit(event.target.value)
                                }
                            }}
                        />
                    </FormGroup>
                    : <p className="col-6 border-top py-2"></p>
            }

            <div className="col-2 py-2 border-top">
                {/* onClick of delete button (trash icon) call deleteTag function with argument of the id of the present tag. */}
                <img className="ms-1" src={deleteIcon} alt="Delete" style={{ maxWidth: 20, maxHeight: 20 }} onClick={
                    () => {
                        TagRepo.deleteTag(presentTag.id)
                            .then(() => TagRepo.getTagsForUser(userId))
                            .then(setTags)
                    }
                } />
                {/* onClick of the edit button, push user to form route, and send along state of the presentTag to the location */}
                <img className="ms-1"  src={editIcon} alt="Edit" style={{ maxWidth: 20, maxHeight: 20 }} onClick={
                    () => {
                        setOpenEditBoolean(!openEditBox)
                    }
                } />
            </div>
        </>

    )
}
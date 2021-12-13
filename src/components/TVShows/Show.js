import React, { useEffect, useState } from "react"
import { Badge, Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import { useHistory } from "react-router";


export const Show = ({ show, setShows }) => {
    const [presentShow, setShow] = useState([])
    const history = useHistory()

    //any time the show prop's id state changes (on page load) get individual show with expanded user, embedded taggedShows (with embedded tags), and embedded showPlatforms (with embedded platforms)
    useEffect(() => {
        ShowRepo.get(show.id)
            .then(setShow)
    }, [show.id])

    //delete show by id. If a current show, set shows with current shows, else set shows with queued shows (to update state appropriately based on current user view)
    const deleteShow = (showId) => {
        if (presentShow.current === true) {
            ShowRepo.delete(showId)
                .then(() => ShowRepo.getAllCurrent()
                    .then(setShows))
        } else {
            ShowRepo.delete(showId)
                .then(() => ShowRepo.getAllQueue()
                    .then(setShows))
        }
    }

    //PUT operation to modify a show from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        ShowRepo.modifyShow({
            name: presentShow.name,
            userId: presentShow.userId,
            current: true,
            streamingServiceId: presentShow.streamingServiceId
        }, presentShow.id)
            //after doing PUT operation, push user to the current list, where the show is now located
            .then(() => history.push("/shows/current"))
    }

    return (
        <div className="mt-5">
            <Card
                body
                color="light"
            >
                <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                    {/* onClick of delete button (trash icon) call deleteShow function with argument of the id of the present show. */}
                    <img className="me-3" src={deleteIcon} alt="Delete" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                        () => { return deleteShow(presentShow.id) }
                    } />
                    {/* onClick of the edit button, push user to form route, and send along state of the presentShow to the location */}
                    <img className="me-1" src={editIcon} alt="Edit" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                        () => {
                            history.push({
                                pathname: "/shows/create",
                                state: presentShow
                            })
                        }
                    } />
                </div>

                <CardBody style={{ paddingTop: 0, marginTop: 0 }}>
                    <CardTitle tag="h4" className="mb-3 mt-0">
                        {/* display show names */}
                        {presentShow.name}
                    </CardTitle>
                    <CardText className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        {presentShow.current ? "Watching" : "Available"} on {
                            presentShow.streamingService?.service
                        }
                    </CardText>
                    <CardText className="my-3">
                        {/* map through the taggedShows for the present show, and display the tag associated with each in a Badge format */}
                        {
                            presentShow.taggedShows?.map(taggedShow => {
                                return <Badge className="my-1 me-1" key={taggedShow.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedShow.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>
                    {/* 
                        If the present show is in the queue, display a "Add to Current" button.
                        If the present show has more than one show platform, display a modal that allows the user
                        to select one platform, then call the addToCurrent function on the modal. 
                        If the present show has only one platform, call the addToCurrent function on this button.
                    */}
                    {
                        presentShow.current === false
                            ? <Button onClick={addToCurrent}> Add to Current </Button>
                            : ""
                    }
                </CardBody>
            </Card>
        </div>

    )
}
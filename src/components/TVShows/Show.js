import React, { useEffect, useState } from "react"
import { Badge, Card, CardBody, CardText, CardTitle, UncontrolledAlert } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import moveIcon from '../../images/MoveFolder3.png';
import sendIcon from '../../images/SendIcon.png';
import { useHistory } from "react-router";
import { RecommendationModal } from "../Social/RecommendationModal";


export const Show = ({ show, setShows }) => {
    const history = useHistory()
    const [presentShow, setShow] = useState([])
    const [successOpenBoolean, setSuccessOpenBoolean] = useState(false)
    const [recommendationOpenBoolean, setRecommendationOpenBoolean] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    //any time the show prop's id state changes (on page load) get individual show with expanded user, embedded taggedShows (with embedded tags), and embedded showPlatforms (with embedded platforms)
    useEffect(() => {
        let mounted = true

        ShowRepo.get(show.id)
            .then((result) => {
                if (mounted) {
                    setShow(result)
                }
            })
            .then(() => setIsLoading(false))

        return () => {
            mounted = false
        }
    }, [show.id])

    //delete show by id. If a current show, set shows with current shows, else set shows with queued shows (to update state appropriately based on current user view)
    const deleteShow = (showId) => {
        if (presentShow.current === true) {
            ShowRepo.delete(showId)
                .then(() => ShowRepo.getAll(true)
                    .then(setShows))
        } else {
            ShowRepo.delete(showId)
                .then(() => ShowRepo.getAll(false)
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
        <div className="mt-4">
            {
                isLoading
                    ? ""
                    : <><RecommendationModal openBoolean={recommendationOpenBoolean} setOpenBoolean={setRecommendationOpenBoolean}
                        presentShow={presentShow} setShowRecoSuccess={setSuccessOpenBoolean} />


                        <Card
                            body
                            color="light"
                            className="rounded shadow-sm border border-info"
                        >
                            {
                                setShows
                                    ?
                                    <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-1">
                                        {/* 
                                If the present show is in the queue, display a "Add to Current" button.
                            */}
                                        {
                                            presentShow.current === false && setShows
                                                ? <button className="imgButton">
                                                    <img src={moveIcon} alt="Move to Current" style={{ maxWidth: 40, maxHeight: 40 }} onClick={addToCurrent} />
                                                </button>
                                                : ""
                                        }
                                        {/* onClick of the edit button, push user to form route, and send along state of the presentShow to the location */}
                                        <button className="imgButton">
                                            <img src={editIcon} alt="Edit" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                                () => {
                                                    history.push({
                                                        pathname: "/shows/create",
                                                        state: presentShow
                                                    })
                                                }
                                            } />
                                        </button>
                                        <button className="imgButton">
                                            <img src={sendIcon} alt="Send" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                                () => {
                                                    setRecommendationOpenBoolean(true)
                                                }
                                            } />
                                        </button>
                                        {/* onClick of delete button (trash icon) call deleteShow function with argument of the id of the present show. */}
                                        <button className="imgButton">
                                            <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                                () => { return deleteShow(presentShow.id) }
                                            } />
                                        </button>

                                    </div>
                                    : ""
                            }

                            <CardBody className="mt-0 pt-0">
                                <CardTitle tag="h4" className={setShows ? "mb-3 mt-0" : "my-3 pt-3"}>
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
                                            return <Badge className="my-1 me-1 shadow-sm" key={taggedShow.id} style={{ fontSize: 15, fontWeight: 600 }} color="tags" pill>
                                                {taggedShow.tag?.tag}
                                            </Badge>
                                        })
                                    }
                                </CardText>
                            </CardBody>
                        </Card>

                        {
                            successOpenBoolean
                                ? <UncontrolledAlert
                                    className=" shadow-sm"
                                    color="success">
                                    Recommendation sent!
                                </UncontrolledAlert>
                                : ""
                        }
                    </>
            }
        </div>

    )
}
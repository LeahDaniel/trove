import React, { useEffect, useState } from "react"
import { Badge, Button, Card, CardBody, CardSubtitle, CardText, CardTitle} from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import { useHistory } from "react-router";
import { PlatformModal } from "./PlatformModal";


export const Game = ({ game, setGames }) => {
    const [currentGame, setGame] = useState([])
    const [openBoolean, setOpenBoolean] = useState(false)
    const history = useHistory()

    //get individual game with expanded user, embedded taggedGames (with embedded tags)
    useEffect(() => {
        GameRepo.get(game.id)
            .then(setGame)
    }, [game.id])

    //delete game by id. If a current game, set games with current games, else set games with queued games (to update state appropriately based on current user view)
    const deleteGame = (gameId) => {
        if (currentGame.current === true) { 
            GameRepo.delete(gameId)
                .then(() => GameRepo.getAllCurrent()
                    .then(setGames))
        } else {
            GameRepo.delete(gameId)
                .then(() => GameRepo.getAllQueue()
                    .then(setGames))
        }
    }

    //PUT operation to allow user to quickly modify a game from queued to current with the click of a button (see button in form below)
    const addToCurrent = () => {
        GameRepo.modifyGame({
            name: currentGame.name,
            userId: currentGame.userId,
            current: true,
            multiplayerCapable: currentGame.multiplayerCapable
        }, currentGame.id)
            .then(() => history.push("/games/current"))
    }

    return (
        <div className="mb-4">
            <PlatformModal openBoolean={openBoolean} setOpenBoolean={setOpenBoolean}
                currentGame={currentGame} addToCurrent={addToCurrent} />

            <Card
                body
                color="light"
            >
                <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                    <img className="me-3"src={deleteIcon} alt="Delete" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                        () => { return deleteGame(currentGame.id) }
                    } />
                    <img className="me-1" src={editIcon} alt="Edit" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                        () => {history.push({
                            pathname: "/games/create",
                            state: currentGame
                        })}
                    } />

                </div>
                <CardBody style={{ paddingTop: 0, marginTop: 0 }}>
                    <CardTitle tag="h4" className="mb-3 mt-0">
                        {currentGame.name}
                    </CardTitle>
                    <CardSubtitle
                        className=" text-muted"
                        tag="h6"
                    >
                        {currentGame.multiplayerCapable === true ? "Multiplayer Capable" : ""}
                    </CardSubtitle>
                    <CardText className="my-3">
                        {currentGame.current? "Playing" : "Available"} on {
                            currentGame.gamePlatforms?.map(gamePlatform => {
                                return gamePlatform.platform?.name
                            }).join(", ")
                        }
                    </CardText>
                    <CardText className="my-3">
                        {
                            currentGame.taggedGames?.map(taggedGame => {
                                return <Badge className="my-1 me-1" key={taggedGame.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedGame.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>
                    {
                        currentGame.current === false
                            ? <Button onClick={() => {
                                currentGame.gamePlatforms?.length > 1
                                    ? setOpenBoolean(true)
                                    : addToCurrent()
                            }
                            }> Add to Current </Button>
                            : ""
                    }
                </CardBody>
            </Card>
        </div>

    )
}
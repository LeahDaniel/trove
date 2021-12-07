import React, { useEffect, useState } from "react"
import { Badge, Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import GameRepo from "../../repositories/GameRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import { useHistory } from "react-router";


export const Game = ({ game, setGames }) => {
    const [currentGame, setGame] = useState([])
    const history = useHistory()

    useEffect(() => {
        //get individual game with expanded user and platform, embedded taggedGames (with embedded tags)
        GameRepo.get(game.id)
            .then(setGame)
    }, [game.id])

    const deleteGame = (gameId) => {
        if(currentGame.current === true){
            GameRepo.delete(gameId)
            .then(() => GameRepo.getAllCurrent()
                .then(setGames))
        } else {
            GameRepo.delete(gameId)
            .then(() => GameRepo.getAllQueue()
                .then(setGames))
        }
    }

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
        <div>
            <Card
                body
                color="light"
            >
                <div style={{ alignSelf: "flex-end" }}>
                    <img src={deleteIcon} alt="Delete" style={{ maxWidth: 30}} onClick={
                        () => {return deleteGame(currentGame.id)}
                    } />
                    
                </div>
                <CardBody style={{ paddingTop: 0, marginTop: 0 }}>
                    <CardTitle tag="h5" >
                        {currentGame.name}
                    </CardTitle>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {currentGame.multiplayerCapable === true ? "Multiplayer Capable" : ""}
                    </CardSubtitle>
                    <CardText>
                        Available on {
                            currentGame.gamePlatforms?.map(gamePlatform => {
                                return gamePlatform.platform?.name
                            }).join(", ")
                        }
                    </CardText>
                    <CardText>
                        {
                            currentGame.taggedGames?.map(taggedGame => {
                                return <Badge key={taggedGame.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedGame.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>
                    {
                        currentGame.current === false
                        ? <Button onClick={addToCurrent}> Add to Current </Button>
                        : ""
                    }
                </CardBody>
            </Card>
        </div>

    )
}
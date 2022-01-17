import React, { useState, useEffect } from "react"
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import deleteIcon from '../../images/DeleteIcon.png';
import { useHistory } from "react-router";
import { SocialRepo } from "../../repositories/SocialRepo";
import { GameRepo } from "../../repositories/GameRepo";


export const GameRecommendation = ({ gameRecommendation, setGameRecommendations }) => {
    const history = useHistory()
    const [game, setGame] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    useEffect(
        () => {
            GameRepo.get(gameRecommendation.gameId)
                .then(setGame)
                .then(() => setIsLoading(false))
        }, [gameRecommendation]
    )

    //delete recommendationby id. If a current game, set games with current games, else set games with queued games (to update state appropriately based on current user view)
    const deleteRecommendation = (id) => {
        SocialRepo.deleteGameRecommendation(id)
            .then(SocialRepo.getAllGameRecommendations)
            .then(setGameRecommendations)
    }


    return (
        <div className="mt-4">
            {
                isLoading
                    ? ""
                    : <Card
                        body
                        color="light"
                        className="rounded shadow border-0"
                    >
                        <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                            {/* onClick of delete button (trash icon) call deleteRecommendationfunction with argument of the id of the present game. */}
                            <button className="imgButton">
                                <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => { return deleteRecommendation(gameRecommendation.id) }
                                } />
                            </button>
                        </div>

                        <CardBody className="mt-0 pt-0">
                            <CardTitle tag="h4" className="mb-3 mt-0" >
                                {/* display recommendationnames */}
                                {game.name}
                            </CardTitle>
                            <CardSubtitle className="mb-3 mt-0" >
                                {/* display sender name */}
                                <em>Recommended by {gameRecommendation.sender.name}</em>
                            </CardSubtitle>
                            <CardText className="my-3">
                                {/* display message (games as empty string if not entered on modal) */}
                                {gameRecommendation.message}
                            </CardText>

                            <Button color="info" onClick={() => {
                                history.push({
                                    pathname: "/games/create",
                                    state: {
                                        name: game.name,
                                        current: false,
                                        multiplayerCapable: game.multiplayerCapable,
                                        tagArray: game.taggedGames.map(taggedGame => taggedGame.tag.tag),
                                        gamePlatforms: game.gamePlatforms
                                    }
                                })
                            }}> Add to Queue </Button>

                        </CardBody>
                    </Card>
            }
        </div>
    )
}
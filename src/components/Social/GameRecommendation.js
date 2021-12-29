import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import { useHistory } from "react-router";
import { SocialRepo } from "../../repositories/SocialRepo";


export const GameRecommendation = ({ gameRecommendation, setGameRecommendations }) => {
    const history = useHistory()

    //delete recommendationby id. If a current game, set games with current games, else set games with queued games (to update state appropriately based on current user view)
    const deleteRecommendation = (id) => {
        SocialRepo.deleteGameRecommendation(id)
            .then(SocialRepo.getAllGameRecommendations)
            .then(setGameRecommendations)
    }


    return (
        <div className="mt-4">
            <Card
                body
                color="light"
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
                        {gameRecommendation.game.name}
                    </CardTitle>
                    <CardSubtitle className="mb-3 mt-0" >
                        {/* display sender name */}
                        Recommended by {gameRecommendation.sender.name}
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* display message (games as empty string if not entered on modal) */}
                        {gameRecommendation.message}
                    </CardText>

                    <Button onClick={() => {
                        history.push({
                            pathname: "/games/create",
                            state: {
                                name: gameRecommendation.game.name,
                                userId: gameRecommendation.recipientId,
                                current: false,
                                multiplayerCapable: gameRecommendation.game.multiplayerCapable,
                            }
                        })
                    }}> Add to Queue </Button>

                </CardBody>
            </Card>
        </div>

    )
}
import React, { useEffect, useState } from "react"
import { Badge, Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import GameRepo from "../../repositories/GameRepo"


export const Game = ({ game, setGames }) => {
    const [currentGame, setGame] = useState([])

    useEffect(() => {
        //get individual location with embedded animals and employees
        GameRepo.get(game.id)
            .then(setGame)
    }, [game.id])

    return (
        <div>
            <Card
                body
                color="light"
            >
                <CardBody>
                    <CardTitle tag="h5">
                        {currentGame.name}
                    </CardTitle>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {currentGame.platform?.platform}{currentGame.multiplayerCapable === true ? ", Multiplayer Capable" : ""}
                    </CardSubtitle>
                    <CardText>
                        {
                            currentGame.taggedGames?.map(taggedGame => {
                                return <Badge key={taggedGame.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedGame.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>
                    <Button>
                        Button
                    </Button>
                </CardBody>
            </Card>
        </div>

    )
}
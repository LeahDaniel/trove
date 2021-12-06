import React, { useEffect, useState } from "react"
import { Badge } from "reactstrap"
import GameRepo from "../../repositories/GameRepo"


export const Game = ({ game }) => {
    const [currentGame, setGame] = useState([])

    useEffect(() => {
        //get individual location with embedded animals and employees
        GameRepo.get(game.id)
            .then(setGame)
    }, [game.id])

    return (
        <article className="card game">
            <section className="card-body">
                <h5 className="card-title">
                    {currentGame.name}
                </h5>
                <div>
                    Platform: {currentGame.platform?.platform}
                </div>
                <div>
                    Multiplayer Capable: {currentGame.multiplayerCapable === true ? "Yes" : "No"}
                </div>
                <div>
                    {
                        currentGame.taggedGames?.map(taggedGame => {
                            return <Badge key={taggedGame.id} color="info" pill>
                                {taggedGame.tag?.tag}
                            </Badge>
                        })
                    }
                </div>
            </section>
        </article>
    )
}
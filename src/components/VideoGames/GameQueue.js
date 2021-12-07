import React, { useState, useEffect } from "react"
import GameRepo from "../../repositories/GameRepo"
import { Game } from "./Game"

export const GameQueue = () => {
    const [games, setGames] = useState([])

    useEffect(
        () => {
            GameRepo.getAllQueue()
                .then(setGames)
        }, []
    )

    return (
        <>
            <div className="games">
                {
                    games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                }
            </div>
        </>
    )
}
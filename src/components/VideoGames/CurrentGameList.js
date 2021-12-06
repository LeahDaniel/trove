import React, { useState, useEffect } from "react"
import GameRepo from "../../repositories/GameRepo"
import { Game } from "./Game"

export const CurrentGameList = () => {
    const [games, setGames] = useState([])

    useEffect(
        () => {
            GameRepo.getAllCurrent()
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
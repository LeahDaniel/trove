import React, { useState, useEffect } from "react"
import { GameRepo } from "../../repositories/GameRepo"
import { Game } from "./Game"
import addIcon from "../../images/AddIcon.png"
import { useHistory } from "react-router"

export const GameQueue = () => {
    const [games, setGames] = useState([])
    const history = useHistory()

    useEffect(
        () => {
            GameRepo.getAllQueue()
                .then(setGames)
        }, []
    )

    return (
        <>
            <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignItems: "flex-end" }} onClick={
                () => history.push("/games/create")
            } />
            <div className="mx-4">
                {
                    games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                }
            </div>
        </>
    )
}
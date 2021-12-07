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
            <img src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }} onClick={
                () => history.push("/games/create")
            } />
            <div className="games">
                {
                    games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                }
            </div>
        </>
    )
}
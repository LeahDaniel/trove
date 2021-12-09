import React, { useState, useEffect } from "react"
import { GameRepo } from "../../repositories/GameRepo"
import { Game } from "./Game"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";

export const CurrentGameList = () => {
    const [games, setGames] = useState([])
    const history = useHistory()

    useEffect(
        () => {
            GameRepo.getAllCurrent()
                .then(setGames)
        }, []
    )

    return (
        <>
            {/* clickable "add" image to bring user to form */}
            <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end"}} 
                onClick={
                () => history.push("/games/create") 
            } />
            {/* Full list of current game cards. Pass state of current game and the setter function to the individual game card component */}
            <div className="mx-4">
                {
                    games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                }
            </div>
        </>
    )
}
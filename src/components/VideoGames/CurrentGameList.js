import React, { useState, useEffect } from "react"
import { GameRepo } from "../../repositories/GameRepo"
import { Game } from "./Game"

export const CurrentGameList = ({setGames, games}) => {
    
    return (
        <>
            {/* //TODO Call searchbar component here. Pass setGames setter function to it. */}
            
            {/* Full list of current game cards. Pass state of current game and the setter function to the individual game card component */}
            <div className="mx-4">
                {
                    games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                }
            </div>
        </>
    )
}
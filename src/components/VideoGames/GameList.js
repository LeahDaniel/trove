import React from "react"
import { useEffect } from "react/cjs/react.development"
import { Card } from "reactstrap"
import { Game } from "./Game"

export const GameList = ({ setGames, games, matchingGames }) => {
    useEffect(
        () => {
            if(matchingGames){
                setGames(matchingGames)
            }
        },
        []
    )
    
    return (
        <>
            {   
                games.length > 0
                    ? <div className="mx-4">
                        {
                            games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                        }
                    </div>
                    : <Card>No search results found</Card>

            }
            {/* Full list of game cards. Pass state of game and the setter function to the individual game card component */}

        </>
    )
}
import React from "react"
import { Game } from "./Game"

export const GameList = ({ setGames, games, userAttemptedSearch }) => {
    return (
        <>
            {
                games.length > 0
                    ? <div className="col-7 mt-4" >
                        {
                            games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                        }
                    </div>
                    : <div
                        className="col-7 mt-4 border-0 d-flex align-items-center justify-content-center"
                    >
                        <h5 className="text-center text-muted">
                            {
                                userAttemptedSearch
                                    ? "No Results Found"
                                    : "Your list is empty. Add an item with the plus (+) button."
                            }
                        </h5>
                    </div>

            }
            {/* Full list of game cards. Pass state of game and the setter function to the individual game card component */}

        </>
    )
}
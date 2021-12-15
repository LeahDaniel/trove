import React from "react"
import { Card, CardBody, CardImg, CardTitle } from "reactstrap"
import { Game } from "./Game"

export const GameList = ({ setGames, games }) => {
    return (
        <>
            {
                games.length > 0
                    ? <div className="col-7 px-3 ps-5" >
                        {
                            games.map(game => <Game key={game.id} game={game} setGames={setGames} />)
                        }
                    </div>
                    : <Card
                        body
                        className="col-7 px-3 ps-5 border-0"
                    >
                        <CardBody className="d-flex align-items-center">
                            <CardTitle tag="h2" className="d-flex align-items-center">
                                No Results Found
                            </CardTitle>
                        </CardBody>
                    </Card>

            }
            {/* Full list of game cards. Pass state of game and the setter function to the individual game card component */}

        </>
    )
}
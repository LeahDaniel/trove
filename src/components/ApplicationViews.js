import React from "react"
import { Route } from "react-router-dom"
import { HomePage } from "./HomePage/HomePage"
import { CurrentGamesView } from "./VideoGames/CurrentGamesView"
import { GameForm } from "./VideoGames/GameForm"
import { GameQueueView } from "./VideoGames/GameQueueView"


export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <HomePage/>
            </Route>
            <Route exact path="/games/current">
                <CurrentGamesView/>
            </Route>
            <Route exact path="/games/create">
                <GameForm/>
            </Route>
            <Route exact path="/games/queue">
                <GameQueueView/>
            </Route>
        </>
    )
}
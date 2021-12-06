import React from "react"
import { Route } from "react-router-dom"
import { HomePage } from "./HomePage/HomePage"
import { CurrentGameList } from "./VideoGames/CurrentGameList"


export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <HomePage/>
            </Route>
            <Route exact path="/games/current">
                <CurrentGameList/>
            </Route>
        </>
    )
}
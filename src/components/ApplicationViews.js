import React from "react"
import { Route } from "react-router-dom"
import { HomePage } from "./HomePage/HomePage"


export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <HomePage/>
            </Route>
        </>
    )
}
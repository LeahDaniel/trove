import React from "react"
import { Route } from "react-router-dom"
import { BookForm } from "./Books/BookForm"
import { BookQueueView } from "./Books/BookQueueView"
import { CurrentBooksView } from "./Books/CurrentBooksView"
import { HomePage } from "./HomePage/HomePage"
import { TagView } from "./Tags/TagView"
import { CurrentShowsView } from "./TVShows/CurrentShowsView"
import { ShowForm } from "./TVShows/ShowForm"
import { ShowQueueView } from "./TVShows/ShowQueueView"
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
            <Route exact path="/shows/current">
                <CurrentShowsView/>
            </Route>
            <Route exact path="/shows/create">
                <ShowForm/>
            </Route>
            <Route exact path="/shows/queue">
                <ShowQueueView/>
            </Route>
            <Route exact path="/books/current">
                <CurrentBooksView/>
            </Route>
            <Route exact path="/books/create">
                <BookForm/>
            </Route>
            <Route exact path="/books/queue">
                <BookQueueView/>
            </Route>
            <Route exact path="/tags">
                <TagView/>
            </Route>
        </>
    )
}
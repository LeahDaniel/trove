import React from "react"
import { Game } from "../VideoGames/Game"
import { Show } from "../TVShows/Show"
import { Book } from "../Books/Book"

export const SearchResults = ({ games, shows, books }) => {

    //!Filter by current and queue
    
    return (

            <article className="searchResults">
                <h2 className="mt-5">Games</h2>
                {   
                    games
                    ? games.map(game => <Game key={game.id} game={game} />)
                    : ""
                }
                <h2 className="mt-5">Shows</h2>
                {
                    shows
                    ? shows.map(show => <Show key={show.id} show={show} />)
                    : ""
                }
                <h2 className="mt-5">Books</h2>
                {
                    books
                    ? books.map(book => <Book key={book.id} book={book} />)
                    : ""
                }
            </article>

    )

}
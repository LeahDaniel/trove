import React from "react"
import { ShowList } from "../TVShows/ShowList"
import { BookList } from "../Books/BookList"
import { GameList } from "../VideoGames/GameList"
import { Game } from "../VideoGames/Game"
import { Show } from "../TVShows/Show"
import { Book } from "../Books/Book"

export const SearchResults = ({ games, shows, books }) => {
    // const displayGames = () => {
    //     //if the state passed from NavBar.js contains games, render the GameList component using that state.
    //     if (games) {
    //         return (
    //             <React.Fragment>
    //                 <h2>Matching Games</h2>
    //                 <section className="games">
    //                     <GameList matchingGames={games} />
    //                 </section>
    //             </React.Fragment>
    //         )
    //     }
    // }

    // const displayShows = () => {
    //     //if the state passed from NavBar.js contains shows, render the showList component using that state.
    //     if (shows) {
    //         return (
    //             <React.Fragment>
    //                 <h2>Matching Shows</h2>
    //                 <section className="shows">
    //                     <ShowList matchingShows={shows} />
    //                 </section>
    //             </React.Fragment>
    //         )
    //     }
    // }


    // const displayBooks = () => {
    //     //if the state passed from NavBar.js contains locations, render the LocationList component using that state.
    //     if (books) {
    //         return (
    //             <React.Fragment>
    //                 <h2>Matching Books</h2>
    //                 <section className="books">
    //                     <BookList matchingBooks={books} />
    //                 </section>
    //             </React.Fragment>
    //         )
    //     }
    // }

    //return all search results as one fragment to be rendered whenever user hits enter key in search box (when user is pushed to /search) 
    return (

            <article className="searchResults">
                {   
                    games
                    ? games.map(game => <Game key={game.id} game={game} />)
                    : ""
                }
                {
                    shows
                    ? shows.map(show => <Show key={show.id} show={show} />)
                    : ""
                }
                {
                    books
                    ? books.map(book => <Book key={book.id} book={book} />)
                    : ""
                }
            </article>

    )

}
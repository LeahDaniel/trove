import React, { useEffect, useState } from 'react';
import { GameRepo } from "../../repositories/GameRepo"
import { ShowRepo } from "../../repositories/ShowRepo"
import { BookRepo } from "../../repositories/BookRepo"
import { FilterForm } from './FilterForm';
import { SearchResults } from './SearchResults';

export const HomePage = () => {
    const [games, setGames] = useState([])
    const [books, setBooks] = useState([])
    const [shows, setShows] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [userEntries, setUserEntries] = useState({
        title: "",
        tags: new Set()
    })


    useEffect(
        () => {
            const tagsExist = userEntries.tags.size > 0
            const noTags = userEntries.tags.size === 0
            const titleExists = userEntries.title !== ""
            const noTitle = userEntries.title === ""

            //filter games, shows, and books array based on tags they're associate with
            const determineGameFilters = (array) => {
                if (tagsExist) {
                    let newGameArray = []

                    for (const game of array) {
                        let booleanArray = []
                        userEntries.tags.forEach(tagId => {
                            const foundGame = game.taggedGames?.find(taggedGame => taggedGame.tagId === tagId)
                            if (foundGame) {
                                booleanArray.push(true)
                            } else {
                                booleanArray.push(false)
                            }
                        })

                        if (booleanArray.every(boolean => boolean === true)) {
                            newGameArray.push(game)
                        }
                    }
                    return newGameArray

                } else if (noTags) {
                    return array
                }
            }
            const determineShowFilters = (array) => {
                if (tagsExist) {
                    let newShowArray = []

                    for (const show of array) {
                        let booleanArray = []
                        userEntries.tags.forEach(tagId => {
                            const foundShow = show.taggedShows?.find(taggedShow => taggedShow.tagId === tagId)
                            if (foundShow) {
                                booleanArray.push(true)
                            } else {
                                booleanArray.push(false)
                            }
                        })

                        if (booleanArray.every(boolean => boolean === true)) {
                            newShowArray.push(show)
                        }
                    }
                    return newShowArray

                } else if (noTags) {
                    return array
                }
            }
            const determineBookFilters = (array) => {
                if (tagsExist) {
                    let newBookArray = []

                    for (const book of array) {
                        let booleanArray = []
                        userEntries.tags.forEach(tagId => {
                            const foundBook = book.taggedBooks?.find(taggedBook => taggedBook.tagId === tagId)
                            if (foundBook) {
                                booleanArray.push(true)
                            } else {
                                booleanArray.push(false)
                            }
                        })

                        if (booleanArray.every(boolean => boolean === true)) {
                            newBookArray.push(book)
                        }
                    }
                    return newBookArray

                } else if (noTags) {
                    return array
                }
            }

            //determine whether to search JSON by name (whether user has entered search term), then determine tag filters with functions above
            if (noTitle) {
                GameRepo.getAll()
                    .then((result) => setGames(determineGameFilters(result)))
                    .then(ShowRepo.getAll)
                    .then((result) => setShows(determineShowFilters(result)))
                    .then(BookRepo.getAll)
                    .then((result) => setBooks(determineBookFilters(result)))
            } else {
                GameRepo.getBySearchTerm(userEntries.title)
                    .then((result) => setGames(determineGameFilters(result)))
                ShowRepo.getBySearchTerm(userEntries.title)
                    .then((result) => setShows(determineShowFilters(result)))
                BookRepo.getBySearchTerm(userEntries.title)
                    .then((result) => setBooks(determineBookFilters(result)))
            }

            //mark whether a user has used the filters in order to determine the message they get for a blank list
            if (titleExists || tagsExist) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

        }, [userEntries]
    )

    return (
        <>
            <div className="p-5 m-5 bg-light border border-secondary">
                <p>Welcome! Please use the navigation bar above to find the list of media you'd like to look through, or use the filter feature below to search through all of your media at once.</p>
                <p className="pt-3">Each media type has a:</p>
                <ul>
                    <li>Current List (for media you are currently watching/playing/etc)</li>
                    <li>Queue (for media you've been recommended or want to watch/play/etc in the future)</li>
                    <li>Option to add a new entry</li>
                </ul>
            </div>
            <div>
                {/* <div className="row justify-content-center mt-4"><h2 className='col-6 text-center'>Your Media</h2></div> */}
                <div className="row justify-content-evenly">
                    <FilterForm userEntries={userEntries} setUserEntries={setUserEntries} />
                    <SearchResults games={games} shows={shows} books={books} userAttemptedSearch={userAttemptedSearch} />
                </div>
            </div>
        </>
    )

}

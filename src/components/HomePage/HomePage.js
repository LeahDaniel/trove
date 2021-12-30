import React, { useEffect, useState } from 'react';
import { GameRepo } from "../../repositories/GameRepo"
import { ShowRepo } from "../../repositories/ShowRepo"
import { BookRepo } from "../../repositories/BookRepo"
import { FilterForm } from './FilterForm';
import { SearchResults } from './SearchResults';

export const HomePage = () => {
    const [userEntries, setUserEntries] = useState({
        title: "",
        tags: new Set()
    })
    const [games, setGames] = useState([])
    const [books, setBooks] = useState([])
    const [shows, setShows] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)


    useEffect(
        () => {
            GameRepo.getAll()
                .then(setGames)
                .then(ShowRepo.getAll)
                .then(setShows)
                .then(BookRepo.getAll)
                .then(setBooks)
        }, []
    )

    useEffect(
        () => {
            const determineFilters = (midFilterArray) => {
                const tagsExist = userEntries.tags.size > 0
                const noTags = userEntries.tags.size === 0

                if (tagsExist) {
                    let newArray = []

                    for (const obj of midFilterArray) {
                        let booleanArray = []
                        userEntries.tags.forEach(tagId => {
                            const foundObj = obj.taggedObjs?.find(taggedObj => taggedObj.tagId === tagId)
                            if (foundObj) {
                                booleanArray.push(true)
                            } else {
                                booleanArray.push(false)
                            }
                        })
                        if (booleanArray.every(boolean => boolean === true)) {
                            newArray.push(obj)
                        }
                    }
                    return [newArray]
                } else if (noTags) {
                    return [midFilterArray]
                }
            }

            if (userEntries.title === "") {
                GameRepo.getAll()
                    .then(result => setGames(determineFilters(result)))
                    .then(ShowRepo.getAll)
                    .then(result => setShows(determineFilters(result)))
                    .then(BookRepo.getAll)
                    .then(result => setBooks(determineFilters(result)))
            } else {
                GameRepo.getAllBySearchTerm(userEntries.title)
                    .then(result => setGames(determineFilters(result)))
                ShowRepo.getAllBySearchTerm(userEntries.title)
                    .then(result => setShows(determineFilters(result)))
                BookRepo.getAllBySearchTerm(userEntries.title)
                    .then(result => setBooks(determineFilters(result)))
            }

            if (userEntries.title !== "" || userEntries.tags.size > 0) {
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

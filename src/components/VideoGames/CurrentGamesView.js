import React, { useEffect, useState } from "react"
import { GameList } from "./GameList"
import { SearchGames } from "./SearchGames"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo";
import { Button, Card } from "reactstrap";
import { TagRepo } from "../../repositories/TagRepo";

export const CurrentGamesView = () => {
    const history = useHistory()
    const [games, setGames] = useState([])
    const [taggedGames, setTaggedGames] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [userEntries, setUserEntries] = useState({
        name: "",
        multiplayer: null,
        platform: "0",
        tags: new Set()
    })

    useEffect(
        () => {
            TagRepo.getTaggedGames()
                .then(result => {
                    const onlyCurrent = result.filter(taggedGame => taggedGame.game?.current === true)
                    setTaggedGames(onlyCurrent)
                })
        }, []
    )

    useEffect(
        () => {
            //variables for whether or not the user has filled in each filter
            const multiplayerExist = userEntries.multiplayer !== null
            const noMultiplayer = userEntries.multiplayer === null
            const platformExist = userEntries.platform !== "0"
            const noPlatform = userEntries.platform === "0"
            const tagsExist = userEntries.tags.size > 0
            const noTags = userEntries.tags.size === 0
            const nameExist = userEntries.name !== ""
            const noName = userEntries.name === ""

            const determineFilters = (midFilterGames) => {
                const multiplayerBoolean = userEntries.multiplayer
                const platformId = parseInt(userEntries.platform)

                const gamesByTagOnly = () => {
                    let newGameArray = []

                    for (const game of midFilterGames) {
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
                }
                const gamesByPlatformOnly = midFilterGames.filter(game => {
                    const foundGamePlatform = game.gamePlatforms.find(gamePlatform => gamePlatform.platformId === platformId)
                    if (foundGamePlatform) {
                        return true
                    } else {
                        return false
                    }
                })
                const gamesByMultiplayerOnly = midFilterGames.filter(game => game.multiplayerCapable === multiplayerBoolean)
                const gamesByMultiplayerAndPlatform = gamesByMultiplayerOnly.filter(game => gamesByPlatformOnly.includes(game))
                const gamesByMultiplayerAndTag = gamesByMultiplayerOnly.filter(game => gamesByTagOnly().includes(game))
                const gamesByTagAndPlatform = gamesByTagOnly().filter(game => gamesByPlatformOnly.includes(game))
                const gamesByAllThree = gamesByTagAndPlatform.filter(game => gamesByMultiplayerOnly.includes(game))


                if (noMultiplayer) {// all of the below are if the multiplayer filter has not been selected
                    // if nothing has been chosen, the value of games state remains the same.
                    if (noPlatform && noTags) {
                        return midFilterGames
                    } else if (platformExist && noTags) {
                        return gamesByPlatformOnly
                        //if a user has not been chosen and the favorites box is checked
                    } else if (noPlatform && tagsExist) {
                        return gamesByTagOnly()
                        //if a user has been chosen AND the favorites box is checked.
                    } else if (platformExist && tagsExist) {
                        return gamesByTagAndPlatform
                    }
                } else if (multiplayerExist) { //all of the below account for the multiplayer filter being selected
                    if (noPlatform && noTags) {
                        return gamesByMultiplayerOnly
                    } else if (platformExist && noTags) {
                        return gamesByMultiplayerAndPlatform
                        //if a user has not been chosen and the favorites box is checked
                    } else if (noPlatform && tagsExist) {
                        return gamesByMultiplayerAndTag
                        //if a user has been chosen AND the favorites box is checked.
                    } else if (platformExist && tagsExist) {
                        return gamesByAllThree
                    }
                }


            }

            if (noName) {
                GameRepo.getAll(true)
                    .then((result) => setGames(determineFilters(result)))
                    .then(() => setLoading(false))
            } else {
                GameRepo.getBySearchTerm(userEntries.name, true)
                    .then((result) => setGames(determineFilters(result)))
                    .then(() => setLoading(false))
            }

            if (nameExist || multiplayerExist || platformExist || tagsExist) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }
        }, [userEntries]
    )

    return (
        <div className="row justify-content-evenly">
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button color="info" size="sm" className="col-sm-10 col-md-8 col-lg-6" onClick={
                        () => history.push("/games/create")
                    }>
                        <img src={addIcon} alt="Add" style={{ maxWidth: 25 }} className="me-2"
                        />
                        Add Game
                    </Button>
                </div>

                <SearchGames setUserEntries={setUserEntries} userEntries={userEntries} taggedGames={taggedGames} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <GameList games={games} setGames={setGames} userAttemptedSearch={userAttemptedSearch} />
            }

        </div>
    )
}
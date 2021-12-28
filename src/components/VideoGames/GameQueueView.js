import { useEffect, useState } from "react/cjs/react.development"
import { GameList } from "./GameList"
import { SearchGames } from "./SearchGames"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo";
import { Card } from "reactstrap";
import { TagRepo } from "../../repositories/TagRepo";

export const GameQueueView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        multiplayer: null,
        platform: "0",
        tags: new Set()
    })
    const history = useHistory()
    const [games, setGames] = useState([])
    const [midFilterGames, setFilteredGames] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [taggedGames, setTaggedGames] = useState([])

    useEffect(
        () => {
            GameRepo.getAllQueue()
                .then(setGames)
                .then(() => setLoading(false))
                .then(() => TagRepo.getTaggedGames())
                .then(result => {
                    const onlyQueued = result.filter(taggedGame => taggedGame.game?.current === false)
                    setTaggedGames(onlyQueued)
                })
                
        }, []
    )

    useEffect(
        () => {
            setGames(determineFilters())
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [midFilterGames]
    )

    useEffect(
        () => {
            if (userEntries.name === "") {
                GameRepo.getAllQueue()
                    .then(setFilteredGames)
            } else {
                GameRepo.getAllQueueBySearchTerm(userEntries.name)
                    .then(setFilteredGames)
            }

            if (userEntries.name !== "" || userEntries.multiplayer !== null || userEntries.platform !== "0" || userEntries.tag !== "0") {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userEntries]
    )

    const determineFilters = () => {
        const multiplayerExist = userEntries.multiplayer !== null
        const noMultiplayer = userEntries.multiplayer === null
        const platformExist = userEntries.platform !== "0"
        const noPlatform = userEntries.platform === "0"
        const tagsExist = userEntries.tags.size > 0
        const noTags = userEntries.tags.size === 0

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
        const gamesByMultiplayerAndTag = gamesByMultiplayerOnly.filter(game => gamesByTagOnly.includes(game))
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



    return (
        <>
            <div className="row">
                {
                    isLoading
                        ? < Card className="col-7 d-flex align-items-center justify-content-center border-0"/>
                        :<GameList games={games} setGames={setGames} userAttemptedSearch={userAttemptedSearch}/>
                }
                <div className="col-5 px-3 pe-5">
                    {/* clickable "add" image to bring user to form */}
                    <div className="row">
                        <div className="col-8"></div>
                        <div className="col-4 pt-5">
                            <img src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                                onClick={
                                    () => history.push("/games/create")
                                } />
                        </div>

                    </div>
                    <SearchGames setUserEntries={setUserEntries} userEntries={userEntries} taggedGames={taggedGames}/>
                </div>
            </div>

        </>

    )
}
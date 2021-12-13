import { useEffect, useState } from "react/cjs/react.development"
import { GameList } from "./GameList"
import { SearchGames } from "./SearchGames"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo";

export const GameQueueView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        multiplayer: null,
        platform: "0",
        tag: "0"
    })
    const history = useHistory()
    const [games, setGames] = useState([])
    const [midFilterGames, setFilteredGames] = useState([])


    useEffect(
        () => {
            GameRepo.getAllQueue()
                .then(setGames)
        }, []
    )
    useEffect(
        () => {
            if (userEntries.name === "") {
                GameRepo.getAllQueue()
                    .then(setFilteredGames)
                    .then(setGames(determineFilters()))
            } else {
                GameRepo.getAllQueueBySearchTerm(userEntries.name)
                    .then(setFilteredGames)
                    .then(setGames(determineFilters()))
                    
            }
        }, [userEntries]
    )


    const determineFilters = () => {
        const multiplayerExist = userEntries.multiplayer !== null
        const noMultiplayer = userEntries.multiplayer === null
        const platformExist = userEntries.platform !== "0"
        const noPlatform = userEntries.platform === "0"
        const tagExist = userEntries.tag !== "0"
        const noTag = userEntries.tag === "0"

        const multiplayerBoolean = userEntries.multiplayer
        const platformId = parseInt(userEntries.platform)
        const tagId = parseInt(userEntries.tag)

        const gamesByTagOnly = midFilterGames.filter(game => {
            const foundTaggedGame = game.taggedGames?.find(taggedGame => taggedGame.tagId === tagId)
            if (foundTaggedGame) {
                return true
            } else {
                return false
            }
        })
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
        const gamesByTagAndPlatform = gamesByTagOnly.filter(game => gamesByPlatformOnly.includes(game))
        const gamesByAllThree = gamesByTagAndPlatform.filter(game => gamesByMultiplayerOnly.includes(game))


        if (noMultiplayer) {// all of the below are if the multiplayer filter has not been selected
            // if nothing has been chosen, the value of games state remains the same.
            if (noPlatform && noTag) {
                return midFilterGames
            } else if (platformExist && noTag) {
                return gamesByPlatformOnly
                //if a user has not been chosen and the favorites box is checked
            } else if (noPlatform && tagExist) {
                return gamesByTagOnly
                //if a user has been chosen AND the favorites box is checked.
            } else if (platformExist && tagExist) {
                return gamesByTagAndPlatform
            }
        } else if (multiplayerExist) { //all of the below account for the multiplayer filter being selected
            if (noPlatform && noTag) {
                return gamesByMultiplayerOnly
            } else if (platformExist && noTag) {
                return gamesByMultiplayerAndPlatform
                //if a user has not been chosen and the favorites box is checked
            } else if (noPlatform && tagExist) {
                return gamesByMultiplayerAndTag
                //if a user has been chosen AND the favorites box is checked.
            } else if (platformExist && tagExist) {
                return gamesByAllThree
            }
        }


    }

    return (
        <div className="d-flex flex-row flex-wrap">
            <GameList games={games} setGames={setGames} />
            <div>
                {/* clickable "add" image to bring user to form */}
                <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                    onClick={
                        () => history.push("/games/create")
                    } />
                <SearchGames setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
        </div>
    )
}
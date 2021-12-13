import { useEffect, useState } from "react/cjs/react.development"
import { ShowList } from "./ShowList"
import { SearchShows } from "./SearchShows"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { ShowRepo } from "../../repositories/ShowRepo";


export const CurrentShowsView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        multiplayer: null,
        platform: "0",
        tag: "0"
    })
    const history = useHistory()
    const [shows, setShows] = useState([])
    const [midFilterShows, setFilteredShows] = useState([])


    useEffect(
        () => {
            ShowRepo.getAllCurrent()
                .then(setShows)
        }, []
    )
    useEffect(
        () => {
            if (userEntries.name === "") {
                ShowRepo.getAllCurrent()
                    .then(setFilteredShows)
                    .then(setShows(determineFilters()))
            } else {
                ShowRepo.getAllCurrentBySearchTerm(userEntries.name)
                    .then(setFilteredShows)
                    .then(setShows(determineFilters()))
                    
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

        const showsByTagOnly = midFilterShows.filter(show => {
            const foundTaggedShow = show.taggedShows?.find(taggedShow => taggedShow.tagId === tagId)
            if (foundTaggedShow) {
                return true
            } else {
                return false
            }
        })
        const showsByPlatformOnly = midFilterShows.filter(show => {
            const foundShowPlatform = show.showPlatforms.find(showPlatform => showPlatform.platformId === platformId)
            if (foundShowPlatform) {
                return true
            } else {
                return false
            }
        })
        const showsByMultiplayerOnly = midFilterShows.filter(show => show.multiplayerCapable === multiplayerBoolean)
        const showsByMultiplayerAndPlatform = showsByMultiplayerOnly.filter(show => showsByPlatformOnly.includes(show))
        const showsByMultiplayerAndTag = showsByMultiplayerOnly.filter(show => showsByTagOnly.includes(show))
        const showsByTagAndPlatform = showsByTagOnly.filter(show => showsByPlatformOnly.includes(show))
        const showsByAllThree = showsByTagAndPlatform.filter(show => showsByMultiplayerOnly.includes(show))


        if (noMultiplayer) {// all of the below are if the multiplayer filter has not been selected
            // if nothing has been chosen, the value of shows state remains the same.
            if (noPlatform && noTag) {
                return midFilterShows
            } else if (platformExist && noTag) {
                return showsByPlatformOnly
                //if a user has not been chosen and the favorites box is checked
            } else if (noPlatform && tagExist) {
                return showsByTagOnly
                //if a user has been chosen AND the favorites box is checked.
            } else if (platformExist && tagExist) {
                return showsByTagAndPlatform
            }
        } else if (multiplayerExist) { //all of the below account for the multiplayer filter being selected
            if (noPlatform && noTag) {
                return showsByMultiplayerOnly
            } else if (platformExist && noTag) {
                return showsByMultiplayerAndPlatform
                //if a user has not been chosen and the favorites box is checked
            } else if (noPlatform && tagExist) {
                return showsByMultiplayerAndTag
                //if a user has been chosen AND the favorites box is checked.
            } else if (platformExist && tagExist) {
                return showsByAllThree
            }
        }


    }

    return (
        <div className="d-flex flex-row flex-wrap">
            <ShowList shows={shows} setShows={setShows} />
            <div>
                {/* clickable "add" image to bring user to form */}
                <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                    onClick={
                        () => history.push("/shows/create")
                    } />
                <SearchShows setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
        </div>
    )
}
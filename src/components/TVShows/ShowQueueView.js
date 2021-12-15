import { useEffect, useState } from "react/cjs/react.development"
import { ShowList } from "./ShowList"
import { SearchShows } from "./SearchShows"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { ShowRepo } from "../../repositories/ShowRepo";

export const ShowQueueView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        service: "0",
        tag: "0"
    })
    const history = useHistory()
    const [shows, setShows] = useState([])
    const [midFilterShows, setFilteredShows] = useState([])


    useEffect(
        () => {
            ShowRepo.getAllQueue()
                .then(setShows)
        }, []
    )

    useEffect(
        () => {
            setShows(determineFilters())
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [midFilterShows]
    )

    useEffect(
        () => {
            if (userEntries.name === "") {
                ShowRepo.getAllQueue()
                    .then(setFilteredShows)
            } else {
                ShowRepo.getAllQueueBySearchTerm(userEntries.name)
                    .then(setFilteredShows)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userEntries.name, userEntries]
    )


    const determineFilters = () => {
        const serviceExist = userEntries.service !== "0"
        const noService = userEntries.service === "0"
        const tagExist = userEntries.tag !== "0"
        const noTag = userEntries.tag === "0"

        const serviceId = parseInt(userEntries.service)
        const tagId = parseInt(userEntries.tag)

        const showsByTagOnly = midFilterShows.filter(show => {
            const foundTaggedShow = show.taggedShows?.find(taggedShow => taggedShow.tagId === tagId)
            if (foundTaggedShow) {
                return true
            } else {
                return false
            }
        })
        const showsByServiceOnly = midFilterShows.filter(show => show.streamingServiceId === serviceId)
        const showsByTagAndService = showsByTagOnly.filter(show => showsByServiceOnly.includes(show))

        if (noService && noTag) {
            return midFilterShows
        } else if (serviceExist && noTag) {
            return showsByServiceOnly
            //if a user has not been chosen and the favorites box is checked
        } else if (noService && tagExist) {
            return showsByTagOnly
            //if a user has been chosen AND the favorites box is checked.
        } else if (serviceExist && tagExist) {
            return showsByTagAndService
        }
    }

    return (
        <div className="row">
            <ShowList shows={shows} setShows={setShows} />
            <div className="col-5 px-3 pe-5">
                {/* clickable "add" image to bring user to form */}
                <div className="row">
                    <div className="col-8"></div>
                    <div className="col-4 pt-5">
                        <img src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                            onClick={
                                () => history.push("/shows/create")
                            } />
                    </div>

                </div>
                <SearchShows setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
        </div>
    )
}
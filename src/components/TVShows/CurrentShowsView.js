import { useEffect, useState } from "react/cjs/react.development"
import { ShowList } from "./ShowList"
import { SearchShows } from "./SearchShows"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { ShowRepo } from "../../repositories/ShowRepo";
import { Button, Card } from "reactstrap";
import { TagRepo } from "../../repositories/TagRepo";

export const CurrentShowsView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        service: "0",
        tags: new Set()
    })
    const history = useHistory()
    const [shows, setShows] = useState([])
    const [midFilterShows, setFilteredShows] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [taggedShows, setTaggedShows] = useState([])


    useEffect(
        () => {
            ShowRepo.getAllCurrent()
                .then(setShows)
                .then(() => {
                    setLoading(false);
                })
                .then(() => TagRepo.getTaggedShows())
                .then(result => {
                    const onlyCurrent = result.filter(taggedShow => taggedShow.show?.current === true)
                    setTaggedShows(onlyCurrent)
                })
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
                ShowRepo.getAllCurrent()
                    .then(setFilteredShows)
            } else {
                ShowRepo.getAllCurrentBySearchTerm(userEntries.name)
                    .then(setFilteredShows)
            }

            if (userEntries.name !== "" || userEntries.service !== "0" || userEntries.tag !== "0") {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userEntries]
    )


    const determineFilters = () => {
        const serviceExist = userEntries.service !== "0"
        const noService = userEntries.service === "0"
        const tagsExist = userEntries.tags.size > 0
        const noTags = userEntries.tags.size === 0

        const serviceId = parseInt(userEntries.service)

        const showsByTagOnly = () => {
            let newShowArray = []

            for (const show of midFilterShows) {
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
        }

        const showsByServiceOnly = midFilterShows.filter(show => show.streamingServiceId === serviceId)
        const showsByTagAndService = showsByTagOnly().filter(show => showsByServiceOnly.includes(show))

        if (noService && noTags) {
            return midFilterShows
        } else if (serviceExist && noTags) {
            return showsByServiceOnly
            //if a user has not been chosen and the favorites box is checked
        } else if (noService && tagsExist) {
            return showsByTagOnly()
            //if a user has been chosen AND the favorites box is checked.
        } else if (serviceExist && tagsExist) {
            return showsByTagAndService
        }
    }

    return (
        <div className="row justify-content-evenly">
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button className="col-6" onClick={
                        () => history.push("/shows/create")
                    }>
                        <img src={addIcon} alt="Add" style={{ maxWidth: 25 }} className="me-2"
                        />
                        Add Show
                    </Button>
                </div>

                <SearchShows setUserEntries={setUserEntries} userEntries={userEntries} taggedShows={taggedShows} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <ShowList shows={shows} setShows={setShows} userAttemptedSearch={userAttemptedSearch} />
            }

        </div>
    )
}
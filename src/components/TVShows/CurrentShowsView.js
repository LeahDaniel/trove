import { useEffect, useState } from "react/cjs/react.development"
import { ShowList } from "./ShowList"
import { SearchShows } from "./SearchShows"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { ShowRepo } from "../../repositories/ShowRepo";
import { Button, Card } from "reactstrap";
import { TagRepo } from "../../repositories/TagRepo";

export const CurrentShowsView = () => {
    const history = useHistory()
    const [shows, setShows] = useState([])
    const [taggedShows, setTaggedShows] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [userEntries, setUserEntries] = useState({
        name: "",
        service: "0",
        tags: new Set()
    })


    useEffect(
        () => {
            TagRepo.getTaggedShows()
                .then(result => {
                    const onlyCurrent = result.filter(taggedShow => taggedShow.show?.current === true)
                    setTaggedShows(onlyCurrent)
                })
        }, []
    )

    useEffect(
        () => {
            //variables for whether or not the user has filled in each filter
            const serviceExist = userEntries.service !== "0"
            const noService = userEntries.service === "0"
            const tagsExist = userEntries.tags.size > 0
            const noTags = userEntries.tags.size === 0
            const nameExist = userEntries.name !== ""
            const noName = userEntries.name === ""

            //filters by tag and streaming service
            const determineFilters = (midFilterShows) => {
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

            if (noName) {
                ShowRepo.getAll(true)
                    .then((result) => setShows(determineFilters(result)))
                    .then(() => setLoading(false))
            } else {
                ShowRepo.getBySearchTerm(userEntries.name, true)
                .then((result) => setShows(determineFilters(result)))
                .then(() => setLoading(false))
            }
            

            if (nameExist || serviceExist || tagsExist) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

        }, [userEntries]
    )


    return (
        <div className="row justify-content-evenly" >
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button color="info" size="sm" className="col-6 text-white" onClick={
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
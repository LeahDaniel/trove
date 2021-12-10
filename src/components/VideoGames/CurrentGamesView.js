import { useEffect, useState } from "react/cjs/react.development"
import { CurrentGameList } from "./CurrentGameList"
import { SearchGames } from "./SearchGames"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo";

export const CurrentGamesView = () => {
    const [nameSearchTerm, setNameSearchTerm] = useState("")
    const [multiplayerFilter, setMultiplayerFilter] = useState(false)
    const [platformFilter, setPlatformFilter] = useState([])
    const [tagFilter, setTagFilter] = useState([])
    const history = useHistory()
    const [games, setGames] = useState([])

    useEffect(
        () => {
            if(nameSearchTerm === ""){
                GameRepo.getAllCurrent()
                .then(setGames)
            } else {
                GameRepo.getAllCurrentBySearchTerm(nameSearchTerm)
                .then(setGames)
            }
            
        }, []
    )

    return (
        <div className="d-flex flex-row flex-wrap">
            <CurrentGameList nameSearchTerm={nameSearchTerm} />
            <div>
                {/* clickable "add" image to bring user to form */}
                <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                    onClick={
                        () => history.push("/games/create")
                    } />
                <SearchGames nameSetter={setNameSearchTerm} multiplayerSetter={setMultiplayerFilter} />
            </div>
        </div>
    )
}
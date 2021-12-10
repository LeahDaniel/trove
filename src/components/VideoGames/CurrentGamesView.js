import { useEffect, useState } from "react/cjs/react.development"
import { CurrentGameList } from "./CurrentGameList"
import { SearchGames } from "./SearchGames"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo";

export const CurrentGamesView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        multiplayer: null,
        platform: 0,
        tag: 0
    })
    const history = useHistory()
    const [games, setGames] = useState([])

    useEffect(
        () => {
            if(userEntries.name === ""){
                GameRepo.getAllCurrent()
                .then(setGames)
            } else {
                GameRepo.getAllCurrentBySearchTerm(userEntries.name)
                .then(setGames)
            }
            
        }, []
    )
    useEffect(
        () => {
            
                GameRepo.getAllCurrentBySearchTerm(userEntries.name)
                .then(setGames)
            
            
        }, [userEntries.name]
    )

    return (
        <div className="d-flex flex-row flex-wrap">
            <CurrentGameList games={games} setGames={setGames}/>
            <div>
                {/* clickable "add" image to bring user to form */}
                <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                    onClick={
                        () => history.push("/games/create")
                    } />
                <SearchGames setUserEntries={setUserEntries} userEntries={userEntries}/>
            </div>
        </div>
    )
}
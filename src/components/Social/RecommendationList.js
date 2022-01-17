import React, { useEffect, useState } from "react"
import { Card } from "reactstrap"
import { SocialRepo } from "../../repositories/SocialRepo"
import { BookRecommendation } from "./BookRecommendation"
import { GameRecommendation } from "./GameRecommendation"
import { ShowRecommendation } from "./ShowRecommendation"

export const RecommendationList = ({setNewNotification}) => {
    const [gameRecommendations, setGameRecommendations] = useState([])
    const [showRecommendations, setShowRecommendations] = useState([])
    const [bookRecommendations, setBookRecommendations] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(
        () => {
            SocialRepo.getAllGameRecommendations()
                .then(setGameRecommendations)
                .then(SocialRepo.getAllBookRecommendations)
                .then(setBookRecommendations)
                .then(SocialRepo.getAllShowRecommendations)
                .then(setShowRecommendations)
                .then(() => setIsLoading(false))
                .then(() => setNewNotification(false))
        }, [setNewNotification]
    )

    useEffect(
        () => {
            if(!isLoading){
                let promiseArray = []

                for(const gameReco of gameRecommendations){
                    promiseArray.push(SocialRepo.modifyGameRecommendation(gameReco.id))
                }
                for(const showReco of showRecommendations){
                    promiseArray.push(SocialRepo.modifyShowRecommendation(showReco.id))
                }
                for(const bookReco of bookRecommendations){
                    promiseArray.push(SocialRepo.modifyBookRecommendation(bookReco.id))
                }
                Promise.all(promiseArray)
            }
        }, [isLoading, gameRecommendations, bookRecommendations, showRecommendations]
    )

    return (
        <div className="row justify-content-center mt-5">
            {
                isLoading ? < Card className="col-9 d-flex align-items-center justify-content-center border-0" />
                    : <div className="col-9">

                        {/* Full list of recommendation cards. Pass state of recommendation and the setter function to the individual recommendation card component */}
                        {
                            gameRecommendations.length > 0 || showRecommendations.length > 0 || bookRecommendations.length > 0
                                ?
                                <>

                                    {
                                        gameRecommendations.length > 0
                                            ? <div className="mt-4" >
                                                {
                                                    gameRecommendations.map(recommendation => <GameRecommendation key={recommendation.id} gameRecommendation={recommendation} setGameRecommendations={setGameRecommendations} />)
                                                }
                                            </div>
                                            : ""
                                    }
                                    {
                                        showRecommendations.length > 0
                                            ? <div className="mt-4" >
                                                {
                                                    showRecommendations.map(recommendation => <ShowRecommendation key={recommendation.id} showRecommendation={recommendation} setShowRecommendations={setShowRecommendations} />)
                                                }
                                            </div>
                                            : ""
                                    }
                                    {
                                        bookRecommendations.length > 0
                                            ? <div className="mt-4" >
                                                {
                                                    bookRecommendations.map(recommendation => <BookRecommendation key={recommendation.id} bookRecommendation={recommendation} setBookRecommendations={setBookRecommendations} />)
                                                }
                                            </div>
                                            : ""
                                    }
                                </>
                                : <div
                                    className="mt-5 pt-5 border-0 d-flex align-items-center justify-content-center"
                                >
                                    <h5 className="mt-5 pt-5 text-center text-muted">
                                        No Recommendations
                                    </h5>
                                </div>
                        }
                    </div>
            }
        </div>
    )
}
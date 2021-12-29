import React, { useEffect } from "react"
import { useState } from "react/cjs/react.development"
import { SocialRepo } from "../../repositories/SocialRepo"
import { BookRecommendation } from "./BookRecommendation"
import { GameRecommendation } from "./GameRecommendation"
import { ShowRecommendation } from "./ShowRecommendation"

export const RecommendationList = () => {
    const [gameRecommendations, setGameRecommendations] = useState([])
    const [showRecommendations, setShowRecommendations] = useState([])
    const [bookRecommendations, setBookRecommendations] = useState([])

    useEffect(
        () => {
            SocialRepo.getAllGameRecommendations()
                .then(setGameRecommendations)
                .then(SocialRepo.getAllBookRecommendations)
                .then(setBookRecommendations)
                .then(SocialRepo.getAllShowRecommendations)
                .then(setShowRecommendations)
        }, []
    )

    return (
        <>

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
                        className="mt-4 border-0 d-flex align-items-center justify-content-center"
                    >
                        <h5 className="text-center text-muted">
                            No Recommendations
                        </h5>
                    </div>
            }
        </>
    )
}
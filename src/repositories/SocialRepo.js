import { fetchIt } from "./Fetch"

const embedSenderAndRecipient = (recommendation, users) => {
    /* 
        map through each taggedGame object (within the game object parameter), add a key named "tag" that has the value of a found tag object
        (should match the tagId on the current taggedGame object)
    */
    recommendation.sender = users.find(user =>  user.id === recommendation.senderId)
    /* 
        map through each gamePlatform on the game object, add a key named "platform" that has the value of a found platform object
        (should match the platformId on the current gamePlatform object)
     */
    recommendation.recipient = users.find(user => user.id === recommendation.recipientId)

    //returns a game object that now has the tag objects embedded in its taggedGames array and platforms embedded in its gamePlatforms array
    return recommendation
}

export const SocialRepo = {
    //GETs
    async getAllUsers() {
        return await fetchIt(`http://localhost:8088/users`)
    },
    async getAllGameRecommendations() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const users = await fetchIt(`http://localhost:8088/users`)
        const recommendations = await fetchIt(`http://localhost:8088/gameRecommendations/?_expand=game&recipientId=${userId}`)
            .then(recommendations => {
                //map through the returned array of recommendations
                const embedded = recommendations.map(recommendation => {
                    //for current recommendation object, embed tag objects onto the embedded taggedRecommendations array
                    recommendation = embedSenderAndRecipient(recommendation, users)
                    // only return recommendation once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return recommendation
                })
                return embedded
            })
        //returns recommendations array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedRecommendations and recommendationPlatforms embedded on first level, and tags and platforms embedded on second level
        return recommendations
    },
    async getAllShowRecommendations() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const users = await fetchIt(`http://localhost:8088/users`)
        const recommendations = await fetchIt(`http://localhost:8088/showRecommendations/?_expand=show&recipientId=${userId}`)
            .then(recommendations => {
                //map through the returned array of recommendations
                const embedded = recommendations.map(recommendation => {
                    //for current recommendation object, embed tag objects onto the embedded taggedRecommendations array
                    recommendation = embedSenderAndRecipient(recommendation, users)
                    // only return recommendation once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return recommendation
                })
                return embedded
            })
        //returns recommendations array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedRecommendations and recommendationPlatforms embedded on first level, and tags and platforms embedded on second level
        return recommendations
    },
    async getAllBookRecommendations() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const users = await fetchIt(`http://localhost:8088/users`)
        const recommendations = await fetchIt(`http://localhost:8088/bookRecommendations/?_expand=book&recipientId=${userId}`)
            .then(recommendations => {
                //map through the returned array of recommendations
                const embedded = recommendations.map(recommendation => {
                    //for current recommendation object, embed tag objects onto the embedded taggedRecommendations array
                    recommendation = embedSenderAndRecipient(recommendation, users)
                    // only return recommendation once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return recommendation
                })
                return embedded
            })
        //returns recommendations array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedRecommendations and recommendationPlatforms embedded on first level, and tags and platforms embedded on second level
        return recommendations
    },
    
    // async getGameRecommendation(id) {
    //     return await fetchIt(`http://localhost:8088/gameRecommendations/${id}?_expand=game`)
    // },
    // async getShowRecommendation(id) {
    //     return await fetchIt(`http://localhost:8088/showRecommendations/${id}?_expand=show`)
    // },
    // async getBookRecommendation(id) {
    //     return await fetchIt(`http://localhost:8088/bookRecommendations/${id}?_expand=book`)
    // },

    //DELETEs
    async deleteGameRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/gameRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteShowRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/showRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteBookRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/bookRecommendations/${id}`,
            "DELETE"
        )
    },

    //POSTs
    async addBookRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8088/bookRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addShowRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8088/showRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addGameRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8088/gameRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },
}


import { fetchIt } from "./Fetch"

const expandTags = (game, tags) => {
    /* 
        map through each taggedGame object (within the game object parameter), add a key named "tag" that has the value of a found tag object
        (should match the tagId on the current taggedGame object)
    */
    game.taggedGames = game.taggedGames.map(taggedGame => {
        taggedGame.tag = tags.find(tag => tag.id === taggedGame.tagId)
        return taggedGame
    })

    //returns a game object that now has the tag objects embedded in its taggedGames array
    return game
}

export default {
    async getAll() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const games = await fetchIt(`http://localhost:8088/games/?_expand=user&_expand=platform&_embed=taggedGames&userId=${userId}`)
            .then(games => {
                //map through the returned array of games
                const embedded = games.map(game => {
                    //for current game object, embed tag objects onto the embedded taggedGames array
                    game = expandTags(game, tags)
                    // only return once 2nd promise (tags- line 26, defined on line 21) is resolved
                    return game
                })
                return embedded
            })
        //returns games array with user and platform expanded, 
        //taggedGames embedded on first level, and tags embedded on second level
        return games
    },
    async getAllCurrent() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const games = await fetchIt(`http://localhost:8088/games/?_expand=user&_expand=platform&_embed=taggedGames&userId=${userId}&current=true`)
            .then(games => {
                //map through the returned array of games
                const embedded = games.map(game => {
                    //for current game object, embed tag objects onto the embedded taggedGames array
                    game = expandTags(game, tags)
                    // only return once 2nd promise (tags- line 26, defined on line 21) is resolved
                    return game
                })
                return embedded
            })
        //returns games array with user and platform expanded, 
        //taggedGames embedded on first level, and tags embedded on second level
        console.log(games)
        console.log(userId)
        return games
    },
    // async function
    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        // await response of fetch call, only proceed to next promise once 1st promise is resolved
        return await fetchIt(`http://localhost:8088/games/${id}?_expand=user&_expand=platform&_embed=taggedGames`)
            .then(game => {
                //for fetched game object, embed tag objects onto the embedded taggedGames array
                game = expandTags(game, tags)
                // only return once 2nd promise (tags- line 44, defined on line 39) is resolved
                return game
                //returns one game object with user and platform expanded, 
                //taggedGames embedded on first level, and tags embedded on second level
            })
    },

    async delete(id) {
        return await fetchIt(`http://localhost:8088/games/${id}`, "DELETE")
    },

    async addAnimal(newGame) {
        return await fetchIt(
            `http://localhost:8088/games`,
            "POST",
            JSON.stringify(newGame)
        )
    },
}

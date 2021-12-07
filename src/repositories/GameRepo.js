import { fetchIt } from "./Fetch"

const embedTagsAndPlatforms = (game, tags, platforms) => {
    /* 
        map through each taggedGame object (within the game object parameter), add a key named "tag" that has the value of a found tag object
        (should match the tagId on the current taggedGame object)
    */
    game.taggedGames = game.taggedGames.map(taggedGame => {
        taggedGame.tag = tags.find(tag => tag.id === taggedGame.tagId)
        return taggedGame
    })
    /* 
        map through each gamePlatform on the game object, add a key named "platform" that has the value of a found platform object
        (should match the platformId on the current gamePlatform object)
     */
    game.gamePlatforms = game.gamePlatforms.map(gamePlatform => {
        gamePlatform.platform = platforms.find(platform => platform.id === gamePlatform.platformId)
        return gamePlatform
    })

    //returns a game object that now has the tag objects embedded in its taggedGames array and platforms embedded in its gamePlatforms array
    return game
}

export default {
    async getAllCurrent() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const platforms = await fetchIt(`http://localhost:8088/platforms`)
        const games = await fetchIt(`http://localhost:8088/games/?_expand=user&_embed=gamePlatforms&_embed=taggedGames&userId=${userId}&current=true`)
            .then(games => {
                //map through the returned array of games
                const embedded = games.map(game => {
                    //for current game object, embed tag objects onto the embedded taggedGames array
                    game = embedTagsAndPlatforms(game, tags, platforms)
                    // only return once 2nd promise (tags) and 3rd promise (platforms) are resolved
                    return game
                })
                return embedded
            })
        //returns games array with user expanded, 
        //taggedGames and gamePlatforms embedded on first level, and tags and platforms embedded on second level
        return games
    },
    async getAllQueue() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const platforms = await fetchIt(`http://localhost:8088/platforms`)
        const games = await fetchIt(`http://localhost:8088/games/?_expand=user&_embed=gamePlatforms&_embed=taggedGames&userId=${userId}&current=false`)
            .then(games => {
                //map through the returned array of games
                const embedded = games.map(game => {
                    //for current game object, embed tag objects onto the embedded taggedGames array
                    game = embedTagsAndPlatforms(game, tags, platforms)
                    // only return once 2nd promise (tags) and 3rd promise (platforms) are resolved
                    return game
                })
                return embedded
            })
        //returns games array with user expanded, 
        //taggedGames and gamePlatforms embedded on first level, and tags and platforms embedded on second level
        return games
    },

    // async function
    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const platforms = await fetchIt(`http://localhost:8088/platforms`)
        // await response of fetch call, only proceed to next promise once 1st promise is resolved
        return await fetchIt(`http://localhost:8088/games/${id}?_expand=user&_embed=gamePlatforms&_embed=taggedGames`)
            .then(game => {
                //for fetched game object, embed tag objects onto the embedded taggedGames array
                game = embedTagsAndPlatforms(game, tags, platforms)
                // only return once 2nd promise (tags- line 44, defined on line 39) is resolved
                return game
                //returns one game object with user and platform expanded, 
                //taggedGames embedded on first level, and tags embedded on second level
            })
    },

    async delete(id) {
        return await fetchIt(`http://localhost:8088/games/${id}`, "DELETE")
    },

    async addGame(newGame) {
        return await fetchIt(
            `http://localhost:8088/games`,
            "POST",
            JSON.stringify(newGame)
        )
    },

    async modifyGame(modifiedGame, id) {
        return await fetchIt(
            `http://localhost:8088/games/${id}`,
            "PUT",
            JSON.stringify(modifiedGame)
        )
    },

    async getAllPlatforms() {
        return await fetchIt(`http://localhost:8088/platforms`)
    },
}

import { fetchIt } from "./FetchAndSort"

const embedTagsAndPlatforms = (game, tags, platforms) => {
    /* 
        map through each taggedGame object (within the game object parameter), add a key named "tag" to each that has the value of a found tag object
        (should match the tagId on the current taggedGame object)
    */
    game.taggedGames = game.taggedGames.map(taggedGame => {
        taggedGame.tag = tags.find(tag => tag.id === taggedGame.tagId)
        return taggedGame
    })
    /* 
        map through each gamePlatform on the game object, add a key named "platform" to each that has the value of a found platform object
        (should match the platformId on the current gamePlatform object)
     */
    game.gamePlatforms = game.gamePlatforms.map(gamePlatform => {
        gamePlatform.platform = platforms.find(platform => platform.id === gamePlatform.platformId)
        return gamePlatform
    })

    //returns a game object that now has the tag objects embedded in its taggedGames array and platforms embedded in its gamePlatforms array
    return game
}

//Object (GameRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const GameRepo = {
    //GETs
    async getAll(current = null) {
        //determine portion of query string parameter that sorts by current by argument of true/false/null (null is initialized)
        if (current === true) {
            current = "&current=true"
        } else if (current === false) {
            current = "&current=false"
        } else {
            current = ""
        }
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const platforms = await fetchIt(`http://localhost:8088/platforms`)
        const games = await fetchIt(`http://localhost:8088/games/?_expand=user&_embed=gamePlatforms&_embed=taggedGames&userId=${userId}${current}`)
            .then(games => {
                //map through the returned array of games
                const embedded = games.map(game => {
                    //for current game object, expand tag objects on the embedded taggedGames array and platforms on the gamePlatforms array
                    game = embedTagsAndPlatforms(game, tags, platforms)
                    // only return once promises are resolved
                    return game
                })
                return embedded
            })
        //returns a games array of objects associated with the current user where each object has the user expanded, the taggedGames and gamePlatforms arrays embedded, and the tags and platforms expanded on those.
        return games
    },

    //identical to the getAll function, but also adds a query string parameter to match a string with the name property
    async getBySearchTerm(searchTerm, current = null) {
        if (current === true) {
            current = "&current=true"
        } else if (current === false) {
            current = "&current=false"
        } else {
            current = ""
        }
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const platforms = await fetchIt(`http://localhost:8088/platforms`)
        const games = await fetchIt(`http://localhost:8088/games/?_expand=user&_embed=gamePlatforms&_embed=taggedGames&userId=${userId}&name_like=${searchTerm}${current}`)
            .then(games => {
                const embedded = games.map(game => {
                    game = embedTagsAndPlatforms(game, tags, platforms)
                    return game
                })
                return embedded
            })
        return games
    },

    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const platforms = await fetchIt(`http://localhost:8088/platforms`)
        return await fetchIt(`http://localhost:8088/games/${id}?_expand=user&_embed=gamePlatforms&_embed=taggedGames`)
            .then(game => {
                //for fetched game object, expand tag objects on the embedded taggedGames array and platform objects on the gamePlatforms array
                game = embedTagsAndPlatforms(game, tags, platforms)
                return game
                //returns one game object with user expanded, 
                //taggedGames and gamePlatforms embedded on first level, and tags and platforms embedded on second level
            })
    },
    async getAllPlatforms() {
        return await fetchIt(`http://localhost:8088/platforms`)
    },

    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8088/games/${id}`, "DELETE")
    },
    async deleteGamePlatformsForOneGame(game) {
        const gamePlatforms = game.gamePlatforms

        let promiseArray = []
        for (const gamePlatform of gamePlatforms) {
            promiseArray.push(await fetchIt(`http://localhost:8088/gamePlatforms/${gamePlatform.id}`, "DELETE"))
        }
        return Promise.all(promiseArray)
    },

    //POSTs
    async addGame(newGame) {
        return await fetchIt(
            `http://localhost:8088/games`,
            "POST",
            JSON.stringify(newGame)
        )
    },
    async addGamePlatform(newGamePlatform) {
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGamePlatform)
        }

        return fetch("http://localhost:8088/gamePlatforms", fetchOptions)
    },

    //PUTs
    async modifyGame(modifiedGame, id) {
        return await fetchIt(
            `http://localhost:8088/games/${id}`,
            "PUT",
            JSON.stringify(modifiedGame)
        )
    },
}
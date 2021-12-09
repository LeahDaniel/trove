import { fetchIt } from "./Fetch"

export const TagRepo = {
    //GETs
    async getAll() {
        return await fetchIt(`http://localhost:8088/tags`)
    },

    //DELETEs
    async deleteTaggedGamesForOneGame(game) {
        const taggedGames = game.taggedGames
        let promiseArray = []
        for(const taggedGame of taggedGames){
            promiseArray.push(await fetchIt(`http://localhost:8088/taggedGames/${taggedGame.id}`, "DELETE"))
        }
        return Promise.all(promiseArray)
    },

    //POSTs
    async addTag(newTag) {
        return await fetchIt(
            `http://localhost:8088/tags`,
            "POST",
            JSON.stringify(newTag)
        )
    },
    async addTaggedGame(newTaggedGame) {
        return await fetchIt(
            `http://localhost:8088/taggedGames`,
            "POST",
            JSON.stringify(newTaggedGame)
        )
    },

}
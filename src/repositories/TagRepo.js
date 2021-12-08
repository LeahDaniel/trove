import { fetchIt } from "./Fetch"

export const TagRepo = {
    async getAll() {
        return await fetchIt(`http://localhost:8088/tags`)
    },

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
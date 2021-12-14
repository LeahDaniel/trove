import { fetchIt } from "./Fetch"

export const TagRepo = {
    //GETs
    async getAll() {
        return await fetchIt(`http://localhost:8088/tags`)
    },
    async get(tagId) {
        return await fetchIt(`http://localhost:8088/tags${tagId}`)
    },

    async getTagsForUser(userId) {
        return await fetchIt(`http://localhost:8088/tags?userId=${userId}`)
    },


    //DELETEs
    async deleteTaggedGamesForOneGame(game) {
        let promiseArray = []
        for (const taggedGame of game.taggedGames) {
            promiseArray.push(await fetchIt(`http://localhost:8088/taggedGames/${taggedGame.id}`, "DELETE"))
        }
        return Promise.all(promiseArray)
    },
    async deleteTaggedShowsForOneShow(show) {
        let promiseArray = []
        for (const taggedShow of show.taggedShows) {
            promiseArray.push(await fetchIt(`http://localhost:8088/taggedShows/${taggedShow.id}`, "DELETE"))
        }
        return Promise.all(promiseArray)
    },
    async deleteTaggedBooksForOneBook(book) {
        let promiseArray = []
        for (const taggedBook of book.taggedBooks) {
            promiseArray.push(await fetchIt(`http://localhost:8088/taggedBooks/${taggedBook.id}`, "DELETE"))
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
    async addTaggedShow(newTaggedShow) {
        return await fetchIt(
            `http://localhost:8088/taggedShows`,
            "POST",
            JSON.stringify(newTaggedShow)
        )
    },
    async addTaggedBook(newTaggedBook) {
        return await fetchIt(
            `http://localhost:8088/taggedBooks`,
            "POST",
            JSON.stringify(newTaggedBook)
        )
    },



    

}


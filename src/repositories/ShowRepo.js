import { fetchIt } from "./Fetch"

const embedTags = (show, tags) => {
    /* 
        map through each taggedShow object (within the show object parameter), add a key named "tag" to each that has the value of a found tag object
        (should match the tagId on the current taggedShow object)
    */
    show.taggedShows = show.taggedShows.map(taggedShow => {
        taggedShow.tag = tags.find(tag => tag.id === taggedShow.tagId)
        return taggedShow
    })

    //returns a show object that now has the tag objects embedded in its taggedShows array
    return show
}

//Object (ShowRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const ShowRepo = {
    //GETs
    async getAll(current = null) {
        if (current === true) {
            current = "&current=true"
        } else if (current === false) {
            current = "&current=false"
        } else {
            current = ""
        }
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}${current}`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, expand tag objects on the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once promises are resolved
                    return show
                })
                return embedded
            })
        //returns a shows array of objects associated with the current user where each object has the user and streamingService expanded, the taggedShows embedded, and the tags expanded on that.
        return shows
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
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}&name_like=${searchTerm}${current}`)
            .then(shows => {
                const embedded = shows.map(show => {
                    show = embedTags(show, tags)
                    return show
                })
                return embedded
            })
        return shows
    },

    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        return await fetchIt(`http://localhost:8088/shows/${id}?_expand=user&_expand=streamingService&_embed=taggedShows`)
            .then(show => {
                //for fetched show object, expand tag objects on the embedded taggedShows array
                show = embedTags(show, tags)
                return show
                //returns one show object with user and streamingService expanded, 
                //taggedShows embedded on first level, and tags embedded on second level
            })
    },

    async getAllStreamingServices() {
        return await fetchIt(`http://localhost:8088/streamingServices`)
    },


    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8088/shows/${id}`, "DELETE")
    },

    //POSTs
    async addShow(newShow) {
        return await fetchIt(
            `http://localhost:8088/shows`,
            "POST",
            JSON.stringify(newShow)
        )
    },

    //PUTs
    async modifyShow(modifiedShow, id) {
        return await fetchIt(
            `http://localhost:8088/shows/${id}`,
            "PUT",
            JSON.stringify(modifiedShow)
        )
    },
}
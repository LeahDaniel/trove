import { fetchIt } from "./Fetch"

const embedTags = (show, tags) => {
    /* 
        map through each taggedShow object (within the show object parameter), add a key named "tag" that has the value of a found tag object
        (should match the tagId on the current taggedShow object)
    */
    show.taggedShows = show.taggedShows.map(taggedShow => {
        taggedShow.tag = tags.find(tag => tag.id === taggedShow.tagId)
        return taggedShow
    })
    
    //returns a show object that now has the tag objects embedded in its taggedShows array and platforms embedded in its showPlatforms array
    return show
}

//Object (ShowRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const ShowRepo = {
    //GETs
    //async functions
    async getAllCurrent() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}&current=true`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, embed tag objects onto the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return show
                })
                return embedded
            })
        //returns shows array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedShows and showPlatforms embedded on first level, and tags and platforms embedded on second level
        return shows
    },
    async getAllQueue() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}&current=false`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, embed tag objects onto the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return show
                })
                return embedded
            })
        //returns shows array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedShows and showPlatforms embedded on first level, and tags and platforms embedded on second level
        return shows
    },
    async getAll() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, embed tag objects onto the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return show
                })
                return embedded
            })
        //returns shows array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedShows and showPlatforms embedded on first level, and tags and platforms embedded on second level
        return shows
    },
    
    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        return await fetchIt(`http://localhost:8088/shows/${id}?_expand=user&_expand=streamingService&_embed=taggedShows`)
            .then(show => {
                //for fetched show object, embed tag objects onto the embedded taggedShows array
                show = embedTags(show, tags)
                return show
                //returns one show object with user and platform expanded, 
                //taggedShows embedded on first level, and tags embedded on second level
            })
    },

    async getAllStreamingServices() {
        return await fetchIt(`http://localhost:8088/streamingServices`)
    },

    //GETs for search functionality
    async getAllCurrentBySearchTerm(searchTerm) {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}&current=true&name_like=${searchTerm}`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, embed tag objects onto the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return show
                })
                return embedded
            })
        //returns shows array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedShows and showPlatforms embedded on first level, and tags and platforms embedded on second level
        return shows
    },
    async getAllQueueBySearchTerm(searchTerm) {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}&current=false&name_like=${searchTerm}`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, embed tag objects onto the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return show
                })
                return embedded
            })
        //returns shows array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedShows and showPlatforms embedded on first level, and tags and platforms embedded on second level
        return shows
    },
    async getAllBySearchTerm(searchTerm) {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const shows = await fetchIt(`http://localhost:8088/shows/?_expand=user&_expand=streamingService&_embed=taggedShows&userId=${userId}&name_like=${searchTerm}`)
            .then(shows => {
                //map through the returned array of shows
                const embedded = shows.map(show => {
                    //for current show object, embed tag objects onto the embedded taggedShows array
                    show = embedTags(show, tags)
                    // only return show once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return show
                })
                return embedded
            })
        //returns shows array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedShows and showPlatforms embedded on first level, and tags and platforms embedded on second level
        return shows
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
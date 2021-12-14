import { fetchIt } from "./Fetch"

const embedTags = (book, tags) => {
    /* 
        map through each taggedBook object (within the book object parameter), add a key named "tag" that has the value of a found tag object
        (should match the tagId on the current taggedBook object)
    */
    book.taggedBooks = book.taggedBooks.map(taggedBook => {
        taggedBook.tag = tags.find(tag => tag.id === taggedBook.tagId)
        return taggedBook
    })
    
    //returns a book object that now has the tag objects embedded in its taggedBooks array and platforms embedded in its bookPlatforms array
    return book
}

//Object (BookRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const BookRepo = {
    //GETs
    //async functions
    async getAllCurrent() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}&current=true`)
            .then(books => {
                //map through the returned array of books
                const embedded = books.map(book => {
                    //for current book object, embed tag objects onto the embedded taggedBooks array
                    book = embedTags(book, tags)
                    // only return book once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return book
                })
                return embedded
            })
        //returns books array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedBooks and bookPlatforms embedded on first level, and tags and platforms embedded on second level
        return books
    },
    async getAllQueue() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}&current=false`)
            .then(books => {
                //map through the returned array of books
                const embedded = books.map(book => {
                    //for current book object, embed tag objects onto the embedded taggedBooks array
                    book = embedTags(book, tags)
                    // only return book once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return book
                })
                return embedded
            })
        //returns books array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedBooks and bookPlatforms embedded on first level, and tags and platforms embedded on second level
        return books
    },
    async getAll() {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}`)
            .then(books => {
                //map through the returned array of books
                const embedded = books.map(book => {
                    //for current book object, embed tag objects onto the embedded taggedBooks array
                    book = embedTags(book, tags)
                    // only return book once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return book
                })
                return embedded
            })
        //returns books array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedBooks and bookPlatforms embedded on first level, and tags and platforms embedded on second level
        return books
    },
    
    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        return await fetchIt(`http://localhost:8088/books/${id}?_expand=user&_expand=author&_embed=taggedBooks`)
            .then(book => {
                //for fetched book object, embed tag objects onto the embedded taggedBooks array
                book = embedTags(book, tags)
                return book
                //returns one book object with user and platform expanded, 
                //taggedBooks embedded on first level, and tags embedded on second level
            })
    },

    async getAllAuthors() {
        return await fetchIt(`http://localhost:8088/authors`)
    },
    async getAuthorsForUser(userId) {
        return await fetchIt(`http://localhost:8088/authors?userId=${userId}`)
    },

    //GETs for search functionality
    async getAllCurrentBySearchTerm(searchTerm) {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}&current=true&q=${searchTerm}`)
            .then(books => {
                //map through the returned array of books
                const embedded = books.map(book => {
                    //for current book object, embed tag objects onto the embedded taggedBooks array
                    book = embedTags(book, tags)
                    // only return book once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return book
                })
                return embedded
            })
        //returns books array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedBooks and bookPlatforms embedded on first level, and tags and platforms embedded on second level
        return books
    },
    async getAllQueueBySearchTerm(searchTerm) {
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}&current=false&q=${searchTerm}`)
            .then(books => {
                //map through the returned array of books
                const embedded = books.map(book => {
                    //for current book object, embed tag objects onto the embedded taggedBooks array
                    book = embedTags(book, tags)
                    // only return book once 1st promise (tags) and 2nd promise (platforms) are resolved
                    return book
                })
                return embedded
            })
        //returns books array once the full promise of fetchIt line 30 is resolved, user is expanded,
        //taggedBooks and bookPlatforms embedded on first level, and tags and platforms embedded on second level
        return books
    },
    

    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8088/books/${id}`, "DELETE")
    },
    
    //POSTs
    async addBook(newBook) {
        return await fetchIt(
            `http://localhost:8088/books`,
            "POST",
            JSON.stringify(newBook)
        )
    },
    async addAuthor(newAuthor) {
        return await fetchIt(
            `http://localhost:8088/authors`,
            "POST",
            JSON.stringify(newAuthor)
        )
    },
    

    //PUTs
    async modifyBook(modifiedBook, id) {
        return await fetchIt(
            `http://localhost:8088/books/${id}`,
            "PUT",
            JSON.stringify(modifiedBook)
        )
    },
}
import { fetchIt } from "./FetchAndSort"

const embedTags = (book, tags) => {
    /* 
        map through each taggedBook object (within the book object parameter), add a key named "tag" to each that has the value of a found tag object
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
    async getAll(current = null) {
        //determine portion of query string parameter that sorts by current by argument of true/false/null (null is initialized)
        if(current === true){
            current = "&current=true"
        } else if (current === false){
            current = "&current=false"
        } else {
            current = ""
        }
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}${current}`)
            .then(books => {
                //map through the returned array of books
                const embedded = books.map(book => {
                    //for current book object, embed tag objects onto the embedded taggedBooks array
                    book = embedTags(book, tags)
                    // only return once promises are resolved
                    return book
                })
                return embedded
            })
        //returns a books array of objects associated with the current user where each object has the user and author expanded and the taggedBooks array embedded (which has the tag expanded)
        return books
    },
    
    //identical to the getAll function, but also adds a query string parameter to match a string with the name property
    async getBySearchTerm(searchTerm, current = null) {
        if(current === true){
            current = "&current=true"
        } else if (current === false){
            current = "&current=false"
        } else {
            current = ""
        }
        const userId = parseInt(localStorage.getItem("trove_user"))
        const tags = await fetchIt(`http://localhost:8088/tags`)
        const books = await fetchIt(`http://localhost:8088/books/?_expand=user&_expand=author&_embed=taggedBooks&userId=${userId}&name_like=${searchTerm}${current}`)
            .then(books => {
                const embedded = books.map(book => {
                    book = embedTags(book, tags)
                    return book
                })
                return embedded
            })
        return books
    }, 

    async get(id) {
        const tags = await fetchIt(`http://localhost:8088/tags`)
        return await fetchIt(`http://localhost:8088/books/${id}?_expand=user&_expand=author&_embed=taggedBooks`)
            .then(book => {
                //for fetched book object, expand tag objects on the embedded taggedBooks array
                book = embedTags(book, tags)
                return book
                //returns one book object with user and author expanded, 
                //taggedBooks embedded on first level, and tags embedded on second level
            })
    },

    async getAllAuthors() {
        return await fetchIt(`http://localhost:8088/authors`)
    },
    async getAuthorsForUser(userId) {
        return await fetchIt(`http://localhost:8088/authors?userId=${userId}`)
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
//fetchIt takes parameters of a url, a method (default of "GET"), and a body (default of null)
export const fetchIt = (url, method = "GET", body = null) => {
    let options = {
        "method": method,
        "headers": {}
    }

    //evaluate the value of method, and execute the case it applies to.
    switch (method) {
        //if the method is POST, add the content-type property onto the headers property
        case "POST":
            options.headers = {
                "Content-Type": "application/json"
            }
            break;
        //if the method is PUT, add the content-type property onto the headers property
        case "PUT":
            options.headers = {
                "Content-Type": "application/json"
            }
            break;
        //if the method is PATCH, add the content-type property onto the headers property
        case "PATCH":
            options.headers = {
                "Content-Type": "application/json"
            }
            break;
        //if the method is anything else other than the above, do nothing (break).
        default:
            break;
    }

    //if a body parameter was entered, use it to add a body property onto the options object
    if (body !== null) {
        options.body = body
    }

    //function returns a promise- the .then. 
    //Parses a fetch (with the url and options arguments as parameters) as javascript.
    return fetch(url, options).then(r => r.json())
}

export const sortByName = (array) => {
    return array.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        if (nameA < nameB) { return -1 }
        if (nameA > nameB) { return 1 }
        return 0 //default return value (no sorting)
    })
}

export const sortByTag = (array) => {
    return array.sort((a, b) => {
        const tagA = a.tag.toLowerCase()
        const tagB = b.tag.toLowerCase()
        if (tagA < tagB) { return -1 }
        if (tagA > tagB) { return 1 }
        return 0 //default return value (no sorting)
    })
}
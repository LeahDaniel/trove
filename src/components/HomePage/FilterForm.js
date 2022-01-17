import { useState, useEffect } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { sortByTag } from "../../repositories/FetchAndSort"
import { TagRepo } from "../../repositories/TagRepo"

export const FilterForm = ({ userEntries, setUserEntries }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [tags, setTags] = useState([])
    const [taggedGames, setTaggedGames] = useState([])
    const [taggedShows, setTaggedShows] = useState([])
    const [taggedBooks, setTaggedBooks] = useState([])
    const [relevantTags, setRelevantTags] = useState([])

    useEffect(
        () => {
            TagRepo.getTagsForUser(userId)
                .then(setTags)
                .then(TagRepo.getTaggedBooks)
                .then(setTaggedBooks)
                .then(TagRepo.getTaggedGames)
                .then(setTaggedGames)
                .then(TagRepo.getTaggedShows)
                .then(setTaggedShows)
        }, [userId]
    )

    useEffect(
        () => {
            
                let newTagArray = []

                for (const tag of tags) {
                    const foundTaggedGame = taggedGames.find(taggedGame => taggedGame.tagId === tag.id)
                    const foundTaggedShow = taggedShows.find(taggedShow => taggedShow.tagId === tag.id)
                    const foundTaggedBook = taggedBooks.find(taggedBook => taggedBook.tagId === tag.id)

                    if (foundTaggedBook || foundTaggedGame || foundTaggedShow) {
                        newTagArray.push(tag)
                    }
                }

                setRelevantTags(sortByTag(newTagArray))

        }, [tags, taggedGames, taggedShows, taggedBooks]
    )

    //check for parameter's value in userEntries.tags Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setTag = (id) => {
        const copy = { ...userEntries }
        copy.tags.has(id)
            ? copy.tags.delete(id)
            : copy.tags.add(id)
        setUserEntries(copy)
    }

    return (
        <div className="col-3 text-white">
            <Form className="pb-2 mt-5 px-3 bg-secondary shadow-sm" style={{borderRadius: 20}}inline>

                <h5 className="text-center pt-5 pb-4">Filters</h5>

                <FormGroup>
                    <Label for="titleSearch">
                        Search by Title
                    </Label>
                    <Input
                        id="titleSearch"
                        type="search"
                        placeholder="Title contains..."
                        value={userEntries.title}
                        onChange={(event) => {
                            const userEntriesCopy = { ...userEntries }
                            userEntriesCopy.title = event.target.value
                            setUserEntries(userEntriesCopy)
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        Tags
                    </Label>
                    <div className="d-flex flex-row flex-wrap justify-content-start">
                        {
                            relevantTags.length > 0
                                ? relevantTags.map(tag => {
                                    return <Button
                                        key={`tag--${tag.id}`}
                                        active={userEntries.tags.has(tag.id) ? true : false}
                                        color="checkbox"
                                        style={{ borderRadius: '20px', fontWeight: 500 }}
                                        outline
                                        size="sm"
                                        className= "mx-1 my-2 text-truncate text-white"
                                        onClick={() => setTag(tag.id)}
                                    >
                                        {tag.tag}
                                    </Button>
                                })
                                : ""
                        }
                    </div>
                </FormGroup>
                <FormGroup className='row justify-content-center'>
                    <Button
                        onClick={() => {
                            const reset = {
                                title: "",
                                tags: new Set()
                            }
                            setUserEntries(reset)
                        }
                        }
                        color="info"
                        size="sm"
                        className="col-sm-11 col-md-9 col-lg-7 col-xl-5 mt-2"
                    >
                        Clear Filters
                    </Button>
                </FormGroup>
            </Form>
        </div>
    )
}
import { useEffect, useState } from "react/cjs/react.development"
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Card, CardBody, CardTitle, CardSubtitle, CardText, Badge, UncontrolledCollapse } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import editIcon from '../../images/EditIcon.png';
import { useHistory } from "react-router"
import { TagRepo } from "../../repositories/TagRepo";

export const EditModal = ({ editBoolean, setEditBoolean, currentGame }) => {
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const history = useHistory()
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        multiplayerCapable: false,
        chosenPlatforms: new Set(),
        chosenCurrentPlatform: 0,
        tagArray: []
    })

    useEffect(
        () => {
            GameRepo.getAllPlatforms()
                .then(setPlatforms)
                .then(() => TagRepo.getAll())
                .then(setTags)
        }, []
    )

    const setPlatform = (id) => {
        const copy = { ...userChoices }
        copy.chosenPlatforms.has(id)
            ? copy.chosenPlatforms.delete(id)
            : copy.chosenPlatforms.add(id)
        setUserChoices(copy)
    }

    const constructGame = evt => {
        evt.preventDefault()

        const gameFromUserChoices = {
            name: userChoices.name,
            userId: parseInt(localStorage.getItem("trove_user")),
            current: userChoices.current,
            multiplayerCapable: userChoices.multiplayerCapable
        }

        GameRepo.addGame(gameFromUserChoices)
            .then((addedGame) => {
                constructTags(addedGame)
                constructGamePlatforms(addedGame)
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/games/current")
                } else {
                    history.push("/games/queue")
                }
            })
    }

    const constructGamePlatforms = (addedGame) => {
        if (userChoices.chosenPlatforms.size > 0) {
            let promiseArray = []
            for (const chosenPlatform of userChoices.chosenPlatforms) {
                const newGamePlatform = {
                    gameId: addedGame.id,
                    platformId: chosenPlatform
                }
                promiseArray.push(GameRepo.addGamePlatform(newGamePlatform))
            }
            Promise.all(promiseArray)
        } else if (userChoices.chosenCurrentPlatform !== 0) {
            const newGamePlatform = {
                gameId: addedGame.id,
                platformId: userChoices.chosenCurrentPlatform
            }
            GameRepo.addGamePlatform(newGamePlatform)
        } else {
            console.log("Whoops! There were no platforms selected")
        }

    }

    const constructTags = (addedGame) => {
        const neutralizedTagsCopy = tags.map(tag => {
            const upperCased = tag.tag.toUpperCase()
            const noSpaces = upperCased.split(" ").join("")
            return {
                id: tag.id,
                tag: noSpaces
            }
        })


        for (const enteredTag of userChoices.tagArray) {
            const neutralizedEnteredTag = enteredTag.toUpperCase().split(" ").join("")
            let foundTag = neutralizedTagsCopy.find(tag => tag.tag === neutralizedEnteredTag)
            if (foundTag) {
                //post a new taggedGame object with that tag
                TagRepo.addTaggedGame({
                    tagId: foundTag.id,
                    gameId: addedGame.id
                })
            } else {
                //post a new tag object with that enteredTag
                TagRepo.addTag({ tag: enteredTag })
                    .then((newTag) => {
                        TagRepo.addTaggedGame({
                            tagId: newTag.id,
                            gameId: addedGame.id
                        })
                    })

                //post a new taggedGame object with the tag object made above

            }
        }
    }

    return (
        <Modal isOpen={editBoolean === true ? true : false} centered size="xl">
            <ModalBody>
                <Card
                    body
                    color="light"
                >
                    <CardBody>
                        <CardTitle tag="h5" >
                            {<img src={editIcon} alt="Edit" id="nameToggler" style={{ maxWidth: 15, marginRight: 10 }} />}
                            {currentGame.name}
                            <UncontrolledCollapse toggler="#nameToggler">
                                <Input
                                    id="gameTitle"
                                    name="title"
                                    placeholder="Enter the title of the game"
                                    onChange={(event) => {
                                        const copy = { ...userChoices }
                                        copy.name = event.target.value
                                        setUserChoices(copy)
                                    }}
                                />
                            </UncontrolledCollapse>
                        </CardTitle>

                        {currentGame.multiplayerCapable === true
                            ? <>
                                <CardSubtitle
                                    className="mb-2 text-muted"
                                    tag="h6"
                                >
                                    <img src={editIcon} alt="Edit" id="multiplayerToggler" style={{ maxWidth: 15, marginRight: 10 }} />
                                    Multiplayer Capable
                                </CardSubtitle>
                                <UncontrolledCollapse toggler="#multiplayerToggler">
                                    <Card>
                                        <CardBody>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed dignissimos esse fuga! Minus, alias.
                                        </CardBody>
                                    </Card>
                                </UncontrolledCollapse>
                            </>
                            : ""}
                        <CardText>
                            <img src={editIcon} alt="Edit" id="platformToggler" style={{ maxWidth: 15, marginRight: 10 }} />
                            Available on {
                                currentGame.gamePlatforms?.map(gamePlatform => {
                                    return gamePlatform.platform?.name
                                }).join(", ")
                            }
                            <UncontrolledCollapse toggler="#platformToggler">
                                <Card>
                                    <CardBody>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed dignissimos esse fuga! Minus, alias.
                                    </CardBody>
                                </Card>
                            </UncontrolledCollapse>
                        </CardText>
                        <CardText>
                            <img src={editIcon} alt="Edit" id="tagToggler" style={{ maxWidth: 15, marginRight: 10 }} />
                            {
                                currentGame.taggedGames?.map(taggedGame => {
                                    return <Badge key={taggedGame.id} style={{ fontSize: 15 }} color="info" pill>
                                        {taggedGame.tag?.tag}
                                    </Badge>
                                })
                            }
                            <UncontrolledCollapse toggler="#tagToggler">
                                <Card>
                                    <CardBody>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed dignissimos esse fuga! Minus, alias.
                                    </CardBody>
                                </Card>
                            </UncontrolledCollapse>
                        </CardText>
                    </CardBody>
                </Card>

            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={() => {
                    }}
                >
                    Submit
                </Button>
                {' '}
                <Button onClick={() => { setEditBoolean(false) }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}
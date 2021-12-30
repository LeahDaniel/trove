import { useEffect } from "react"
import { useState } from "react/cjs/react.development"
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Input, Label, Alert } from "reactstrap"
import { SocialRepo } from "../../repositories/SocialRepo"

export const RecommendationModal = ({ openBoolean, setOpenBoolean, presentGame, presentShow, presentBook, setBookRecoSuccess, setGameRecoSuccess, setShowRecoSuccess }) => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    const [emailEntry, setEmailEntry] = useState("")
    const [messageEntry, setMessageEntry] = useState("")
    const [warningBoolean, setWarningBoolean] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(
        () => {
            let mounted = true

            SocialRepo.getAllUsers()
                .then((result) => {
                    if (mounted) {
                        setUsers(result)
                    }
                })

            return () => {
                mounted = false
            }

        }, []
    )

    return (
        //control whether the modal is being displayed based on the openBoolean prop (changed when the Add to Current button on Game.js is clicked, or when close on modal is clicked)
        <Modal isOpen={openBoolean === true ? true : false}>
            <ModalBody className="mt-4">
                <FormGroup className="mt-4">
                    <Label>
                        Enter the email of the user you'd like to recommend this media to.
                    </Label>
                    <Input
                        id="emailEntry"
                        name="emailEntry"
                        type="email"
                        onChange={(event) => {
                            setEmailEntry(event.target.value)
                        }}
                    >
                    </Input>
                </FormGroup>
                {
                    warningBoolean
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                This user does not exist. Please enter the email address of an existing user or click "Cancel".
                            </Alert>
                        </div>
                        : ""
                }
                <FormGroup className="mt-4">
                    <Label>
                        Message
                    </Label>
                    <Input
                        id="messageEntry"
                        name="messageEntry"
                        type="textarea"
                        onChange={(event) => {
                            setMessageEntry(event.target.value)
                        }}
                    >
                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="dark"
                    onClick={() => {
                        const foundUser = users.find(user => user.email === emailEntry)

                        if (foundUser && presentGame) {
                            SocialRepo.addGameRecommendation({
                                senderId: userId,
                                recipientId: foundUser.id,
                                gameId: presentGame.id,
                                message: messageEntry
                            })
                                .then(() => {
                                    setGameRecoSuccess(true)
                                })
                                .then(() => {
                                    setOpenBoolean(false)
                                })
                        } else if (foundUser && presentShow) {
                            SocialRepo.addShowRecommendation({
                                senderId: userId,
                                recipientId: foundUser.id,
                                showId: presentShow.id,
                                message: messageEntry
                            })
                                .then(() => {
                                    setShowRecoSuccess(true)
                                })
                                .then(() => {
                                    setOpenBoolean(false)
                                })
                        } else if (foundUser && presentBook) {
                            SocialRepo.addBookRecommendation({
                                senderId: userId,
                                recipientId: foundUser.id,
                                bookId: presentBook.id,
                                message: messageEntry
                            })
                                .then(() => {
                                    setBookRecoSuccess(true)
                                })
                                .then(() => {
                                    setOpenBoolean(false)
                                })
                        } else {
                            setWarningBoolean(true)
                        }
                    }


                    }
                >
                    Submit
                </Button>
                {/* set boolean state to false when cancel button is clicked to hide modal */}
                <Button onClick={() => {
                    setWarningBoolean(false)
                    setOpenBoolean(false)
                }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}
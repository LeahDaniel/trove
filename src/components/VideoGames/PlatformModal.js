import { useState } from "react/cjs/react.development"
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Input } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"

export const PlatformModal = ({ openBoolean, setOpenBoolean, presentGame, addToCurrent }) => {
    const [chosenPlatformId, setChosenPlatformId] = useState(0)

    return (
        //control whether the modal is being displayed based on the openBoolean prop (changed when the Add to Current button on Game.js is clicked, or when close on modal is clicked)
        <Modal isOpen={openBoolean === true ? true : false}>
            <ModalBody className="mt-4">
                Please select which platform you chose to play this game on.
                <FormGroup className="mt-4">
                    <Input
                        id="exampleSelect"
                        name="select"
                        type="select"
                        onChange={(event) => {
                            setChosenPlatformId(parseInt(event.target.value))
                        }}
                    >
                        {/* select for each platform currently associated with the presentGame object prop*/}
                        <option value="0">Choose a platform...</option>
                        {
                            presentGame.gamePlatforms?.map(gamePlatform => {
                                return <option key={gamePlatform.platformId} value={gamePlatform.platformId}>
                                    {gamePlatform.platform?.name}
                                </option>
                            })
                        }
                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="dark"
                    onClick={() => {
                        //on submit, delete all gamePlatforms for the present game, then re-add the one that was chosen
                        //on this modal. Call the addToCurrent function (from props) to perform PUT operation and push user to current list
                        GameRepo.deleteGamePlatformsForOneGame(presentGame)
                            .then(() => {
                                GameRepo.addGamePlatform({
                                    gameId: presentGame.id,
                                    platformId: chosenPlatformId
                                })
                            })
                            .then(addToCurrent)
                    }}
                >
                    Submit
                </Button>
                {' '}
                {/* set boolean state to false when cancel button is clicked to hide modal */}
                <Button onClick={() => { setOpenBoolean(false) }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}
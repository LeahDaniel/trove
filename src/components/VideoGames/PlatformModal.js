import { useState } from "react/cjs/react.development"
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"

export const PlatformModal = ({ openBoolean, setOpenBoolean, currentGame, addToCurrent }) => {
    const [chosenPlatformId, setChosenPlatformId] = useState(0)

    return (
        <Modal isOpen={openBoolean === true ? true : false}>
            <ModalBody>
                Please select which platform you chose to play this game on.
                <FormGroup>
                    <Label for="exampleSelect">
                        Select
                    </Label>
                    <Input
                        id="exampleSelect"
                        name="select"
                        type="select"
                        onChange={(event) => {
                            setChosenPlatformId(parseInt(event.target.value))
                        }}
                    >
                        <option value="0">Choose a platform...</option>
                        {
                            currentGame.gamePlatforms?.map(gamePlatform => {
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
                    color="primary"
                    onClick={() => {
                        GameRepo.deleteGamePlatformsForOneGame(currentGame)
                            .then(() => {
                                GameRepo.addGamePlatform({
                                    gameId: currentGame.id,
                                    platformId: chosenPlatformId
                                })
                            })
                            .then(addToCurrent)
                    }}
                >
                    Submit
                </Button>
                {' '}
                <Button onClick={() => { setOpenBoolean(false) }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}
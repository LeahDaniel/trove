import React, { useEffect, useState } from "react"
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavLink, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown, NavbarText } from "reactstrap"
import troveIcon from "../../images/TroveIcon.png"
import notificationIcon from "../../images/NotificationIcon.png"
import { SocialRepo } from "../../repositories/SocialRepo"

export const NavBar = () => {
    const userId = parseInt(localStorage.getItem("trove_user"))
    //initialize state to open and close navbar when toggler is clicked.
    const [isOpen, setIsOpen] = useState(false)
    const [newNotification, setNewNotification] = useState(false)
    const [user, setUser] = useState({})
    const [receivedBookRecommendations, setReceivedBookRecommendations] = useState([])
    const [receivedGameRecommendations, setReceivedGameRecommendations] = useState([])
    const [receivedShowRecommendations, setReceivedShowRecommendations] = useState([])

    useEffect(
        () => {
            SocialRepo.getAllShowRecommendations(userId)
                .then(setReceivedShowRecommendations)
                .then(() => SocialRepo.getAllGameRecommendations(userId))
                .then(setReceivedGameRecommendations)
                .then(() => SocialRepo.getAllBookRecommendations(userId))
                .then(setReceivedBookRecommendations)
                .then(() => SocialRepo.getUser(userId))
                .then(setUser)
        }, [userId]
    )

    useEffect(
        () => {
            const foundBookRecommendation = receivedBookRecommendations.find(bookReco => bookReco.read === false)
            const foundGameRecommendation = receivedGameRecommendations.find(gameReco => gameReco.read === false)
            const foundShowRecommendation = receivedShowRecommendations.find(showReco => showReco.read === false)
            if (foundBookRecommendation || foundGameRecommendation || foundShowRecommendation) {
                setNewNotification(true)
            }
        }, [receivedBookRecommendations, receivedGameRecommendations, receivedShowRecommendations]
    )



    return (
        <Navbar
            color="black"
            expand="lg"
            dark
            className="shadow-sm"
        >
            <NavbarBrand className="p-3 text-navLink  " href="/">
                <img className=" me-3" alt="Treasure Chest: Trove Logo" style={{ maxWidth: 40, maxHeight: 40 }} src={troveIcon}></img>
                Trove
            </NavbarBrand>
            <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
            <Collapse isOpen={isOpen} className="ms-3" navbar>
                <Nav navbar>
                    <UncontrolledDropdown
                        inNavbar
                        nav
                        className="align-self-start me-4 mt-2 pt-1 ps-1 ms-1"
                    >
                        <DropdownToggle
                            caret
                            nav
                            className="text-navLink"
                        >
                            Video Games
                        </DropdownToggle>
                        <DropdownMenu end >
                            <DropdownItem>
                                <NavLink className="text-black" href="/games/current">Current</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink className="text-black" href="/games/queue">Queue</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink className="text-black" href="/games/create">Create New</NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown
                        inNavbar
                        nav
                        className="align-self-start me-4 mt-2 pt-1 ps-1 ms-1"
                    >
                        <DropdownToggle
                            caret
                            nav
                            className="text-navLink"
                        >
                            TV Shows
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem>
                                <NavLink className="text-black" href="/shows/current">Current</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink className="text-black" href="/shows/queue">Queue</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink className="text-black" href="/shows/create">Create New</NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown
                        inNavbar
                        nav
                        className="align-self-start me-4 mt-2 pt-1 ps-1 ms-1"
                    >
                        <DropdownToggle
                            caret
                            nav
                            className="text-navLink"
                        >
                            Books
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem>
                                <NavLink className="text-black" href="/books/current">Current</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink className="text-black" href="/books/queue">Queue</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink className="text-black " href="/books/create">Create New</NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <NavItem className="align-self-start mt-2 pt-1 ps-1 ms-1">
                        <NavLink className="text-navLink me-4 " href="/tags">Tags</NavLink>
                    </NavItem>
                    <NavItem className="d-flex flex-row align-self-start mt-2 ps-1 ms-1 pt-1">
                        {
                            newNotification
                                ? <img src={notificationIcon}
                                    alt="New notification!"
                                    style={{ maxWidth: 20, maxHeight: 20 }}
                                    className="align-self-start mt-2 me-1 p-0"></img>
                                : ''
                        }
                        <NavLink className= "text-navLink align-self-start me-4 ps-0" href="/recommendations">Recommendations</NavLink>
                    </NavItem>
                    <NavItem className="d-flex flex-column align-self-start gradient2 border border-primary px-2 py-1 mt-1 rounded">
                            <NavbarText className="p-0 align-self-start text-black">
                                {user.name}
                            </NavbarText>
                            <NavLink className="text-navLink p-0 align-self-start" href="/login" onClick={
                                () => {
                                    localStorage.removeItem("trove_user")
                                }
                            }>
                                Logout
                            </NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}


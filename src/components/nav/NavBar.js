import React, { useState } from "react"
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavLink, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from "reactstrap"
import troveIcon from "../../images/TroveIcon.png"

export const NavBar = () => {
    //initialize state to open and close navbar when toggler is clicked.
    const [isOpen, setIsOpen] = useState(false)

    return (
            <Navbar
                color="primary"
                expand="lg"
                light
                className="shadow-sm"
            >
                <NavbarBrand className="p-3 text-dark" href="/">
                    <img className="me-3" alt="Treasure Chest: Trove Logo" style={{ maxWidth: 35, maxHeight: 35 }} src={troveIcon}></img>
                    Trove
                </NavbarBrand>
                <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
                <Collapse isOpen={isOpen} className="ms-3" navbar>
                    <Nav navbar >
                        <UncontrolledDropdown
                            inNavbar
                            nav
                        >
                            <DropdownToggle
                                caret
                                nav
                                className="text-body ps-4"
                            >
                                Video Games
                            </DropdownToggle>
                            <DropdownMenu end >
                                <DropdownItem>
                                    <NavLink className="text-body" href="/games/current">Current</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/games/queue">Queue</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink className="text-body"href="/games/create">Create New</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown
                            inNavbar
                            nav
                        >
                            <DropdownToggle
                                caret
                                nav
                                className="text-body ps-4"
                            >
                                TV Shows
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/shows/current">Current</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/shows/queue">Queue</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/shows/create">Create New</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown
                            inNavbar
                            nav
                        >
                            <DropdownToggle
                                caret
                                nav
                                className="text-body ps-4"
                            >
                                Books
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/books/current">Current</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/books/queue">Queue</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink className="text-body" href="/books/create">Create New</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem >
                            <NavLink className="text-body ps-4" href="/tags">Tags</NavLink>
                        </NavItem>
                        <NavItem >
                            <NavLink className="text-body ps-4" href="/recommendations">Recommendations</NavLink>
                        </NavItem>
                        <NavItem >
                            <NavLink className="text-body ps-4" href="/login" onClick={
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


import React, { useState } from "react"
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavLink, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from "reactstrap"

export const NavBar = () => {
    //initialize state to open and close navbar when toggler is clicked.
    const [isOpen, setIsOpen] = useState(false)

    return (
            <Navbar
                color="light"
                expand="sm"
                light
            >
                <NavbarBrand className="p-3" href="/">
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
                            >
                                Video Games
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>
                                    <NavLink href="/games/current">Current</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/games/queue">Queue</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/games/create">Create New</NavLink>
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
                            >
                                TV Shows
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>
                                    <NavLink href="/shows/current">Current</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/shows/queue">Queue</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/shows/create">Create New</NavLink>
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
                            >
                                Books
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>
                                    <NavLink href="/books/current">Current</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/books/queue">Queue</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/books/create">Create New</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem >
                            <NavLink href="/tags">Tags</NavLink>
                        </NavItem>
                        <NavItem >
                            <NavLink href="/recommendations">Recommendations</NavLink>
                        </NavItem>
                        <NavItem >
                            <NavLink href="/login" onClick={
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


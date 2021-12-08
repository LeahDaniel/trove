import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown } from "reactstrap"

export const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <Navbar
                color="light"
                expand="md"
                light
                style={{marginLeft: -33}}
            >
                <NavbarBrand href="/">
                    Trove
                </NavbarBrand>
                <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav
                        className="me-auto"
                        navbar
                    >
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
                                    <Link to="/games/current">Current</Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/games/queue">Queue</Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/games/create">Create New</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavLink to="#" onClick={
                            () => {
                                localStorage.removeItem("trove_user")
                            }
                        }>
                            Logout
                        </NavLink>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}


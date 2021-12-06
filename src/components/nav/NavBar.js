import React, { useState } from "react"
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown } from "reactstrap"

export const NavBar = () => {
    //Links for the navbar that go to a certain address. These do not cause any function to run- that is the role of the route
    return (
        <div>
            <Navbar
                color="light"
                expand="md"
                light
            >
                <NavbarBrand href="/">
                    Trove
                </NavbarBrand>
                <NavbarToggler onClick={function noRefCheck() { }} />
                <Collapse navbar>
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
                                    Current
                                </DropdownItem>
                                <DropdownItem>
                                    Queue
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}


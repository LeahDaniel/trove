import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Button, Card, CardText, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Row, TabContent, TabPane } from "reactstrap"

export const NavBar = () => {
    const [activeTab, setActiveTab] = useState('1');
    //Links for the navbar that go to a certain address. These do not cause any function to run- that is the role of the route
    return (
        <div>
            <Nav justified tabs>
                <NavItem>
                    <NavLink
                        className={activeTab === '1' ? 'active' : ''} 
                        onClick={() => setActiveTab('1')}
                        to= "/"
                    >
                        Homepage
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === '2' ? 'active' : ''} 
                        onClick={() => setActiveTab('2')}
                        to= ""
                    >
                        Video Games
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="6">
                            <Card body>
                                <CardText>
                                    The games you have started but haven't finished yet.
                                </CardText>
                                <Button>
                                    Current Video Games
                                </Button>
                            </Card>
                        </Col>
                        <Col sm="6">
                            <Card body>
                                <CardText>
                                    The games you want to buy and play in the future
                                </CardText>
                                <Button>
                                    Video Game Queue
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    )
}

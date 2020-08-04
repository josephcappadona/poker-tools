import React from 'react';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

export default class PrimaryNavbar extends React.Component {

    handleLogout(event) {
        sessionStorage.clear()
    }

    render() {
        return (
            <Navbar bg="light" expand="sm">
                <Navbar.Brand href="/home">LP</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="/play">Play</Nav.Link> */}
                        <NavDropdown title="Study" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/analyzer">Range Analyzer</NavDropdown.Item>
                            <NavDropdown.Item href="/rejam">Rejam Calculator</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link hidden={sessionStorage.getItem('token') !== null} href="/login">Login</Nav.Link>
                        <Nav.Link hidden={sessionStorage.getItem('token') !== null} href="/register">Register</Nav.Link>
                        <NavDropdown hidden={sessionStorage.getItem('token') === null} title="Account" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                            <NavDropdown.Item href="/logout" onClick={this.handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
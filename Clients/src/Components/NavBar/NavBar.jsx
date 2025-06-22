import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import logo from "../Images/FEASTOFESTHERIMAGES/logo.jpeg";
import { Link, NavLink } from "react-router-dom";

const NavigationBar = () => {
  const [navExpanded, setNavExpanded] = useState(false);

  const handleNavLinkClick = () => {
    setNavExpanded(false);
  };

  return (
    <div className="bg-white nav has-sticky sticky-jump shadow-lg">
      <Container>
        <Navbar expand="lg" variant="light" sticky="top" expanded={navExpanded}>
          <Link
            to="/"
            className="d-inline-flex align-items-center text-decoration-none"
          >
            <Navbar.Brand>
              <img
                src={logo}
                width="60"
                height="60"
                className="d-inline-block align-top rounded-pill board"
                alt="Logo"
              />
            </Navbar.Brand>
            <p className="feel">Feast Of Esther NA</p>
          </Link>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setNavExpanded(!navExpanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto navs">
              <NavLink
                to="/"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                About Us
              </NavLink>
              <NavLink
                to="/gallery"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Gallery
              </NavLink>
              <NavLink
                to="/founder"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                The Founder
              </NavLink>
              <NavLink
                to="/leaders"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Leaders
              </NavLink>
              <NavLink
                to="/events"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Events
              </NavLink>
              <NavLink
                to="/registration"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Registration
              </NavLink>
              <NavLink
                to="/donate"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Donate
              </NavLink>
              <NavLink
                to="/contact"
                className="nav-link mx-2"
                onClick={handleNavLinkClick}
              >
                Contact
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  );
};

export default NavigationBar;

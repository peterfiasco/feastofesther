import React from "react";
import NavigationBar from "../NavBar/NavBar";
import { Container } from 'react-bootstrap'
import "./Header.css";

function Header() {
  return (
    <>
      <div>
        <Container fluid className="header position-sticky ">
          <NavigationBar />
        </Container>
      </div>
    </>
  );
}

export default Header;

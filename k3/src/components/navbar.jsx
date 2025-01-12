// React
import React, { useState } from "react";
// Firebase
import { getAuth, signOut } from "firebase/auth";
// Comonents
import CrudModal from "./crudModal";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";

const NavBar = ({ userName }) => {
  // Modals
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");

  // Modal actions
  const handleShowModal = (id, modalName) => {
    setModalName(modalName);
    setSelectedId(id);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedId(null); // Clear the selected ID
  };

  // Logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Redirect to login or homepage after logout
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container fluid>
        {userName ? (
          <Navbar.Brand href="/totals">K3</Navbar.Brand>
        ) : (
          <Navbar.Brand href="#home">K3</Navbar.Brand>
        )}

        {/* Toggler for small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {userName && (
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Left-aligned items */}
            <Nav className="me-auto">
              <Nav.Link href="/laskut">Kaikki menot</Nav.Link>
              <Nav.Link href="/laskut">Kaikki tulot</Nav.Link>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleShowModal(0, "create")}
              >
                Lisää lasku
              </Button>
            </Nav>
            {/* Right-aligned items */}
            <Nav className="ms-auto">
              <NavDropdown title={userName} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => handleLogout()}>
                  Kirjaudu ulos
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        )}
        <CrudModal
          modalName={modalName}
          id={selectedId}
          show={showModal}
          onClose={handleCloseModal}
        />
      </Container>
    </Navbar>
  );
};

export default NavBar;

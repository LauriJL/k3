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
      <Container>
        <Navbar.Brand href="#home">K3</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {userName && (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/laskut">Maksetut laskut</Nav.Link>
              <Nav.Link onClick={() => handleShowModal(0, "create")}>
                Lisää lasku
              </Nav.Link>
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

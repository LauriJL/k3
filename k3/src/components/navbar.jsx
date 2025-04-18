// React
import React, { useState, useContext } from "react";

// Components
import InvoiceCrudModal from "./invoiceCrudModal";
import IncomeCrudModal from "./incomeCrudModal";
import BalanceCrudModal from "./balanceCrudModal";
import HandleLogout from "../functions/logOut";
// Context
import { Context } from "../context/authContext";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";

const NavBar = () => {
  // Cntext
  const { userName } = useContext(Context);
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
              <Nav.Link href="/laskut">Menot</Nav.Link>
              <Nav.Link href="#">
                {" "}
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleShowModal(0, "createInvoice")}
                >
                  Lisää meno
                </Button>
              </Nav.Link>

              <Nav.Link href="/tulot">Tulot</Nav.Link>
              <Nav.Link href="#">
                {" "}
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleShowModal(0, "createIncome")}
                >
                  Lisää tulo
                </Button>
              </Nav.Link>
              <Nav.Link href="#">
                {" "}
                <Button
                  float="left"
                  variant="success"
                  size="sm"
                  onClick={() => handleShowModal(0, "updateBalance")}
                >
                  Päivitä saldo
                </Button>
              </Nav.Link>
            </Nav>
            {/* Right-aligned items */}
            <Nav className="ms-auto">
              <NavDropdown title={userName} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => HandleLogout()}>
                  Kirjaudu ulos
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        )}
        {modalName === "createInvoice" && (
          <InvoiceCrudModal
            modalName={modalName}
            id={selectedId}
            show={showModal}
            onClose={handleCloseModal}
          />
        )}
        {modalName === "createIncome" && (
          <IncomeCrudModal
            modalName={modalName}
            id={selectedId}
            show={showModal}
            onClose={handleCloseModal}
          />
        )}
        {modalName === "updateBalance" && (
          <BalanceCrudModal
            modalName={modalName}
            id={selectedId}
            show={showModal}
            onClose={handleCloseModal}
          />
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;

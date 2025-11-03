import "../App.css";
// React
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase
import { auth } from "../firebase/firebase_config";
import { signOut } from "firebase/auth";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../store/authSlice";
import { setSelectedYear } from "../store/yearSlice";
import { markInternalNavigation } from "../functions/logOutOnClose";
// Components
import LoginModal from "./loginModal";
import InvoiceCrudModal from "./invoiceCrudModal";
import IncomeCrudModal from "./incomeCrudModal";
import BalanceCrudModal from "./balanceCrudModal";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";

const NavBar = () => {
  const logged = useSelector((state) => state.auth.logged);
  const email = useSelector((state) => state.email.eMail);
  // const selectedYear = useSelector((state) => state.year.selectedYear);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const handleShowLoginModal = (modalName) => {
    setModalName(modalName);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedId(null); // Clear the selected ID
  };

  // Logout
  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(setSelectedYear(currentYear));
    signOut(auth).catch(() => {
      /* ignore errors during unload */
    });
    navigate("/");
  };

  // Selected year change handler
  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    // Dispatch action to update selected year in the store
    dispatch(setSelectedYear(newYear));
  };

  // Current year selection
  const d = new Date();
  let currentYear = d.getFullYear();
  // NavBar links
  const handleNavLink = (path) => {
    // Mark internal navigation so the unload handler doesn't treat this as a tab close
    try {
      markInternalNavigation();
    } catch (e) {}
    navigate(path);
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container fluid>
        {!logged ? (
          <Navbar.Brand href="/" className="branding">
            K3
          </Navbar.Brand>
        ) : (
          <Navbar.Brand
            className="branding"
            onClick={() => handleNavLink("/totals")}
          >
            K3
          </Navbar.Brand>
        )}
        {/* Toggler for small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left-aligned items */}
          {logged ? (
            <Nav className="me-auto">
              <Nav.Link>
                {" "}
                <Button
                  float="left"
                  variant="success-outline"
                  size="sm"
                  onClick={() => handleNavLink("/laskut")}
                >
                  Menot
                </Button>
              </Nav.Link>
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

              <Nav.Link>
                {" "}
                <Button
                  float="left"
                  variant="success-outline"
                  size="sm"
                  onClick={() => handleNavLink("/tulot")}
                >
                  Tulot
                </Button>
              </Nav.Link>
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
          ) : null}
          {/* Right-aligned items */}
          <Nav className="ms-auto">
            {!logged ? (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleShowLoginModal("login")}
                >
                  Kirjaudu sisään
                </Button>
              </>
            ) : (
              <>
                <Nav.Link>
                  <li className="nav-item year-select">
                    <select class="custom-select" onChange={handleYearChange}>
                      <option selected>{currentYear}</option>
                      <option value={currentYear - 1}>{currentYear - 1}</option>
                      <option value={currentYear + 1}>{currentYear + 1}</option>
                    </select>
                  </li>
                </Nav.Link>
                <NavDropdown title={email} id="logOut-dropdown">
                  <NavDropdown.Item onClick={() => handleLogOut()}>
                    Kirjaudu ulos
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        {modalName === "login" && (
          <LoginModal
            modalName={modalName}
            id={1}
            show={showModal}
            onClose={handleCloseModal}
          />
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

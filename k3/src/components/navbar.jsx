// Firebase
import { getAuth, signOut } from "firebase/auth";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavBar = ({ userName }) => {
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
              <NavDropdown title={userName} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => handleLogout()}>
                  Kirjaudu ulos
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;

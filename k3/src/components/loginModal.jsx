import "../App.css";
// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase sign in function
import { auth } from "../firebase/firebase_config";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../store/authSlice";
import { setEmailStore } from "../store/emailSlice";

// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const LoginModal = ({ show, onClose, modalName }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const logged = useSelector((state) => state.auth.logged);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  function emptyValues() {
    setEmail("");
    setPassword("");
    onClose();
  }

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Attempting to log in with:", email);

    try {
      await signInWithEmailAndPassword(auth, email, password); // Use Firebase's signInWithEmailAndPassword method
      dispatch(logIn());
      console.log("User logged in successfully");
      onClose();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Tarkista käyttäjätunnus ja salasana.");
    }
  };

  if (logged) {
    dispatch(setEmailStore(email));
  }
  return (
    <div>
      <Modal show={show} onHide={onClose} data-bs-backdrop="static" centered>
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>
            {modalName === "login" && <p>Kirjaudu sisään</p>}
          </Modal.Title>
        </Modal.Header>
        {modalName === "login" && (
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Käyttäjätunnus</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Käyttäjätunnus"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Salasana</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Salasana"
                  required
                />
              </Form.Group>
              {error && (
                <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
              )}
              &nbsp;
            </Form>
          </Modal.Body>
        )}

        <Modal.Footer>
          {modalName === "login" && (
            <Button variant="success" type="submit" onClick={handleSubmit}>
              Kirjaudu
            </Button>
          )}
          &nbsp;
          <Button variant="secondary" onClick={() => emptyValues()}>
            Takaisin
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginModal;

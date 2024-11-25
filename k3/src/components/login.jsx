// React
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase sign in function
import { auth } from "../firebase/firebase_config";
// Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password); // Use Firebase's signInWithEmailAndPassword method
      setLoggedIn(true);
    } catch (error) {
      setError("Tarkista käyttäjätunnus ja salasana.");
    }
  };

  if (loggedIn) {
    navigate("/maksetut");
  }

  return (
    <Container className="p-5">
      <h1>Kirjaudu sisään</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Sähköpostiosoite"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Salasana"
            required
          />
        </Form.Group>
        {error && <Alert variant={"danger"}>{error}</Alert>}
        <Button variant="primary" type="submit">
          Kirjaudu
        </Button>
        &nbsp;
        <Button variant="secondary" onClick={() => navigate("/")}>
          Takaisin
        </Button>
      </Form>
    </Container>
  );
};

export default Login;

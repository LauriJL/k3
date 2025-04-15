// React
import React, { useState, useEffect } from "react";
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
import { ref, onValue, update } from "firebase/database";

// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const BalanceCrudModal = ({ id, show, onClose, modalName }) => {
  // State variables for data
  const [saldo, setSaldo] = useState("");
  const [huom, setHuom] = useState("");

  useEffect(() => {
    // Reference to income data in the database
    const balanceRef = ref(mydatabase, "saldo/");
    // Fetch the existing data when the component mounts
    onValue(balanceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSaldo(data.saldo);
      }
    });
  }, [id]);

  function emptyValues() {
    setSaldo("");
    setHuom("");
    onClose();
  }

  // Date
  const unixTimeStamp = Math.round(new Date().getTime() / 1000);
  const today = new Date(unixTimeStamp * 1000).toLocaleDateString("fi-FI");

  // Update balance entry
  const handleUpdateBalance = (e) => {
    e.preventDefault();

    // Create an object with the updated fields
    const updatedData = {
      saldo: saldo,
      pvm: today,
      huom: huom,
    };

    // Reference to the specific income in the database
    const balanceRef = ref(mydatabase, "saldo/");
    // Update method to update the fields in the database
    update(balanceRef, updatedData)
      .then(() => {
        console.log("Saldo päivitetty!");
        emptyValues();
      })
      .catch((error) => {
        console.error("Saldon päivitys epäonnistui: ", error);
      });
  };

  return (
    <div>
      <Modal show={show} onHide={onClose} data-bs-backdrop="static" centered>
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>
            {modalName === "updateBalance" && <p>Päivitä tilin saldo</p>}
          </Modal.Title>
        </Modal.Header>
        {modalName === "updateBalance" && (
          <Modal.Body>
            <Form onSubmit={handleUpdateBalance}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Saldo</Form.Label>
                <Form.Control
                  type="number"
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value)}
                  placeholder="Saldo"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Huom</Form.Label>
                <Form.Control
                  type="text"
                  value={huom}
                  onChange={(e) => setHuom(e.target.value)}
                  placeholder="Huom"
                />
              </Form.Group>
              &nbsp;
            </Form>
          </Modal.Body>
        )}
        <Modal.Footer>
          {modalName === "updateBalance" && (
            <Button
              variant="primary"
              type="submit"
              onClick={handleUpdateBalance}
            >
              Päivitä
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

export default BalanceCrudModal;

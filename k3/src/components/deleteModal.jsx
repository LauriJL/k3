// React
import React, { useState, useEffect } from "react";
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
import { ref, onValue, remove } from "firebase/database";
// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteModal = ({ id, show, onClose, triggerAlert }) => {
  const invoiceId = id;

  // State variables for data
  const [saaja, setSaaja] = useState("");
  const [summa, setSumma] = useState("");
  const [maksupvm, setMaksupvm] = useState("");

  useEffect(() => {
    // Reference to invoice data in the database
    const invoiceRef = ref(mydatabase, "menot/" + invoiceId);

    // Fetch the existing data when the component mounts
    onValue(invoiceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSaaja(data.saaja || "");
        setSumma(data.summa || "");
        setMaksupvm(data.maksupvm || "");
      }
    });
  }, [invoiceId]);

  // Delete
  const deleteItem = (invoiceId) => {
    const itemRef = ref(mydatabase, "menot/" + invoiceId);
    remove(itemRef)
      .then(() => {
        console.log("Lasku poistettu");
        onClose();
      })
      .catch((error) => {
        console.log("Laskun poisto epäonnistui: ", error);
      });
  };

  return (
    <div>
      <Modal show={show} onHide={onClose} data-bs-backdrop="static" centered>
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>
            <p>Poistetaanko lasku?</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Saaja: </b>
            {saaja}
          </p>
          <p>
            <b>Laksun summa: </b>
            {summa}
          </p>
          <p>
            <b>Maksettu: </b>
            {maksupvm}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            type="submit"
            onClick={() => {
              deleteItem(invoiceId);
            }}
          >
            Poista lasku
          </Button>
          &nbsp;
          <Button variant="secondary" onClick={() => onClose()}>
            Takaisin
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteModal;

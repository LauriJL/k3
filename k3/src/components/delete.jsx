import React, { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
// Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const DeleteData = ({ triggerAlert }) => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  // State variables for data
  const [saaja, setSaaja] = useState("");
  const [summa, setSumma] = useState("");
  const [erapvm, setErapvm] = useState("");
  const [maksupvm, setMaksupvm] = useState("");
  const [maksuluokka, setMaksuluokka] = useState("");

  useEffect(() => {
    // Reference to invoice data in the database
    const invoiceRef = ref(mydatabase, "menot/" + invoiceId);

    // Fetch the existing data when the component mounts
    onValue(invoiceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSaaja(data.saaja || "");
        setSumma(data.summa || "");
        setErapvm(data.erapvm || "");
        setMaksupvm(data.maksupvm || "");
        setMaksuluokka(data.maksuluokka || "");
      }
    });
  }, [invoiceId]); // The effect runs when the component mounts or the invoiceId changes

  // Delete
  const deleteItem = (invoiceId) => {
    const itemRef = ref(mydatabase, "menot/" + invoiceId);
    remove(itemRef)
      .then(() => {
        triggerAlert("Lasku poistettu");
        navigate("/maksetut");
      })
      .catch((error) => {
        triggerAlert("Laskun poisto epäonnistui: ", error);
      });
  };

  return (
    <Container className="p-5">
      <h3>Poistetaanko lasku?</h3>
      <br />
      <p>
        <b>Maksun saaja: </b>
        {saaja}
      </p>
      <p>
        <b>Laskun summa: </b>
        {summa}
      </p>
      <p>
        <b>Maksettu: </b>
        {maksupvm}
      </p>
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
      <Button variant="outline-secondary" onClick={() => navigate("/maksetut")}>
        Takaisin
      </Button>
    </Container>
  );
};

export default DeleteData;

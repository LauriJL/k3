// React
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import { writeInvoiceData } from "./writeComponent";
// Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AddData = () => {
  const navigate = useNavigate();

  const [saaja, setSaaja] = useState("");
  const [summa, setSumma] = useState("");
  const [erapvm, setErapvm] = useState("");
  const [maksupvm, setMaksupvm] = useState("");
  const [maksuluokka, setMaksuluokka] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!saaja || !summa || !erapvm || !maksupvm || !erapvm || !maksuluokka) {
      alert("Anna kaikki tarvittavat tiedot.");
      return;
    }

    const invoiceId = "invoice"; // You can generate or retrieve a user ID based on your logic
    writeInvoiceData(invoiceId, saaja, summa, erapvm, maksupvm, maksuluokka); // Call the function to write data
    navigate("/maksetut");
  }

  return (
    <Container className="p-5">
      <h3>Lisää lasku</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Saaja</Form.Label>
          <Form.Control
            type="text"
            value={saaja}
            onChange={(e) => setSaaja(e.target.value)}
            placeholder="Saaja"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Summa</Form.Label>
          <Form.Control
            type="number"
            value={summa}
            onChange={(e) => setSumma(e.target.value)}
            placeholder="Summa"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Eräpäivämäärä</Form.Label>
          <Form.Control
            type="date"
            value={erapvm}
            onChange={(e) => setErapvm(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Maksupäivämäärä</Form.Label>
          <Form.Control
            type="date"
            value={maksupvm}
            onChange={(e) => setMaksupvm(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Maksuluokka</Form.Label>
          <Form.Control
            type="text"
            value={maksuluokka}
            onChange={(e) => setMaksuluokka(e.target.value)}
            placeholder="Maksuluokka"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" onSubmit={handleSubmit}>
          Lisää
        </Button>
      </Form>
    </Container>
  );
};

export default AddData;

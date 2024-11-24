import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
// Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const UpdateData = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object with the updated fields
    const updatedData = {
      saaja: saaja,
      summa: summa,
      erapvm: erapvm,
      maksupvm: maksupvm,
      maksuluokka: maksuluokka,
    };

    // Reference to the specific invoice in the database
    const invoiceRef = ref(mydatabase, "menot/" + invoiceId);

    // Update method to update the fields in the database
    update(invoiceRef, updatedData)
      .then(() => {
        console.log("Laskun tiedot päivitetty!");
        navigate("/maksetut");
      })
      .catch((error) => {
        console.error("Tietojen päivitys epäonnistui:", error);
      });
  };

  return (
    <Container className="p-5">
      <h3>Päivitä laskun tietoja</h3>
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
        <Button variant="outline-primary" type="submit" onSubmit={handleSubmit}>
          Päivitä tiedot
        </Button>
        &nbsp;
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/maksetut")}
        >
          Takaisin
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateData;

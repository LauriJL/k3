// React
import React, { useState, useEffect } from "react";
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
import { ref, onValue, remove, update } from "firebase/database";
// Components
import { writeInvoiceData } from "../functions/writeInvoice";
import InvoiceCategoryDropDown from "./invoiceCategoryDropDown";

// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const InvoiceCrudModal = ({ id, show, onClose, modalName }) => {
  const invoiceId = id;

  // State variables for data
  const [saaja, setSaaja] = useState("");
  const [summa, setSumma] = useState("");
  const [erapvm, setErapvm] = useState("");
  const [maksupvm, setMaksupvm] = useState("");
  const [maksuluokka, setMaksuluokka] = useState("");
  const [huom, setHuom] = useState("");
  const [year, setYear] = useState("2025");

  // Handle dropdown value change
  const handleInvoiceDropdownChange = (value) => {
    setMaksuluokka(value);
  };

  function emptyValues() {
    setSaaja("");
    setSumma("");
    setErapvm("");
    setMaksupvm("");
    setMaksuluokka("");
    onClose();
  }

  // Create invoice entry
  function handleCreateInvoice(e) {
    e.preventDefault();

    if (!saaja || !summa || !erapvm || !maksuluokka) {
      alert("Anna kaikki tarvittavat tiedot.");
      return;
    }

    const invoiceId = "invoice";
    writeInvoiceData(
      year,
      invoiceId,
      saaja,
      summa,
      erapvm,
      maksupvm,
      maksuluokka,
      huom
    ); // Call the function to write data
    onClose();
  }

  useEffect(() => {
    if (invoiceId !== 0) {
      // Reference to invoice data in the database
      const invoiceRef = ref(mydatabase, "menot/" + year + "/" + invoiceId);
      // Fetch the existing data when the component mounts
      onValue(invoiceRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSaaja(data.saaja || "");
          setSumma(data.summa || "");
          setErapvm(data.erapvm || "");
          setMaksupvm(data.maksupvm || "");
          setMaksuluokka(data.maksuluokka || "");
          setHuom(data.huom || "");
        }
      });
    }
  }, [invoiceId, year]);

  // Delete invoice entry
  const deleteInvoiceItem = (invoiceId) => {
    const itemRef = ref(mydatabase, "menot/" + year + "/" + invoiceId);
    remove(itemRef)
      .then(() => {
        console.log("Lasku poistettu");
        emptyValues();
      })
      .catch((error) => {
        console.log("Laskun poisto epäonnistui: ", error);
      });
  };

  // Update invoice entry
  const handleUpdateInvoice = (e) => {
    e.preventDefault();

    // Create an object with the updated fields
    const updatedData = {
      saaja: saaja,
      summa: summa,
      erapvm: erapvm,
      maksupvm: maksupvm,
      maksuluokka: maksuluokka,
      huom: huom,
    };

    // Reference to the specific invoice in the database
    const invoiceRef = ref(mydatabase, "menot/2025/" + invoiceId);
    // Update method to update the fields in the database
    update(invoiceRef, updatedData)
      .then(() => {
        console.log("Laskun tiedot päivitetty!");
        emptyValues();
      })
      .catch((error) => {
        console.error("Tietojen päivitys epäonnistui:", error);
      });
  };

  return (
    <div>
      <Modal show={show} onHide={onClose} data-bs-backdrop="static" centered>
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>
            {modalName === "deleteInvoice" && <p>Poistetaanko meno?</p>}
            {modalName === "updateInvoice" && <p>Muokkaa menon tietoja</p>}
            {modalName === "createInvoice" && <p>Lisää meno</p>}
          </Modal.Title>
        </Modal.Header>
        {modalName === "createInvoice" && (
          <Modal.Body>
            <Form onSubmit={handleCreateInvoice}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Saaja</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setSaaja(e.target.value)}
                  placeholder="Saaja"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Summa</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setSumma(e.target.value)}
                  placeholder="Summa"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Eräpäivämäärä</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setErapvm(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Maksupäivämäärä</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setMaksupvm(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Maksuluokka</Form.Label>
                <InvoiceCategoryDropDown
                  handleChange={handleInvoiceDropdownChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Huom</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setHuom(e.target.value)}
                  placeholder="Huom"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        )}
        {modalName === "deleteInvoice" && (
          <Modal.Body>
            <p>
              <b>Saaja: </b>
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
            <p>
              <b>Huom: </b>
              {huom}
            </p>
          </Modal.Body>
        )}
        {modalName === "updateInvoice" && (
          <Modal.Body>
            <Form onSubmit={handleUpdateInvoice}>
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
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Maksuluokka</Form.Label>
                <InvoiceCategoryDropDown
                  value={maksuluokka}
                  handleChange={handleInvoiceDropdownChange}
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
          {modalName === "createInvoice" && (
            <Button
              variant="success"
              type="submit"
              onClick={handleCreateInvoice}
            >
              Lisää
            </Button>
          )}
          {modalName === "deleteInvoice" && (
            <Button
              variant="danger"
              type="submit"
              onClick={() => {
                deleteInvoiceItem(invoiceId);
              }}
            >
              Poista lasku
            </Button>
          )}
          {modalName === "updateInvoice" && (
            <Button
              variant="primary"
              type="submit"
              onClick={handleUpdateInvoice}
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

export default InvoiceCrudModal;

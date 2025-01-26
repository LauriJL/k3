// React
import React, { useState, useEffect } from "react";
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
import { ref, onValue, remove, update } from "firebase/database";
// Components
import { writeInvoiceData } from "../functions/writeComponent";
import CategoryDropDown from "./categoryDropDown";
// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const CrudModal = ({ id, show, onClose, modalName }) => {
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
  const handleDropdownChange = (value) => {
    setMaksuluokka(value);
  };

  // Create
  function handleCreate(e) {
    e.preventDefault();

    if (!saaja || !summa || !erapvm || !erapvm || !maksuluokka) {
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

  function emptyValues() {
    setSaaja("");
    setSumma("");
    setErapvm("");
    setMaksupvm("");
    setMaksuluokka("");
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
  }, [invoiceId]);

  // Delete
  const deleteItem = (invoiceId) => {
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

  // Update
  const handleUpdate = (e) => {
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
    console.log(invoiceId, invoiceRef);
    // Update method to update the fields in the database
    update(invoiceRef, updatedData)
      .then(() => {
        console.log("Laskun tiedot päivitetty!");
        console.log(updatedData);
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
            {modalName === "delete" && <p>Poistetaanko lasku?</p>}
            {modalName === "update" && <p>Muokkaa laskun tietoja</p>}
            {modalName === "create" && <p>Lisää lasku</p>}
          </Modal.Title>
        </Modal.Header>
        {modalName === "create" && (
          <Modal.Body>
            <Form onSubmit={handleCreate}>
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
                <CategoryDropDown handleChange={handleDropdownChange} />
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
        {modalName === "delete" && (
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
            <p>
              <b>Huom: </b>
              {huom}
            </p>
          </Modal.Body>
        )}
        {modalName === "update" && (
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
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
                <CategoryDropDown
                  value={maksuluokka}
                  handleChange={handleDropdownChange}
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
          {modalName === "create" && (
            <Button variant="success" type="submit" onClick={handleCreate}>
              Lisää
            </Button>
          )}
          {modalName === "delete" && (
            <Button
              variant="danger"
              type="submit"
              onClick={() => {
                deleteItem(invoiceId);
              }}
            >
              Poista lasku
            </Button>
          )}
          {modalName === "update" && (
            <Button variant="primary" type="submit" onClick={handleUpdate}>
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

export default CrudModal;

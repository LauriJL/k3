// React
import React, { useState, useEffect } from "react";
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
import { ref, onValue, remove, update } from "firebase/database";
// Components
import { writeIncomeData } from "../functions/writeIncome";
import IncomeCategoryDropDown from "./incomeCategoryDD";

// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const IncomeCrudModal = ({ id, show, onClose, modalName }) => {
  const incomeId = id;

  // State variables for data
  const [maksaja, setMaksaja] = useState("");
  const [summa, setSumma] = useState("");
  const [maksupvm, setMaksupvm] = useState("");
  const [tuloluokka, setTuloluokka] = useState("");
  const [huom, setHuom] = useState("");
  const [year, setYear] = useState("2025");

  // Handle dropdown value change
  const handleIncomeDropdownChange = (value) => {
    setTuloluokka(value);
  };

  function emptyValues() {
    setMaksaja("");
    setSumma("");
    setMaksupvm("");
    setTuloluokka("");
    onClose();
  }

  // Create income entry
  function handleCreateIncome(e) {
    e.preventDefault();

    if (!maksaja || !summa || !maksupvm || !tuloluokka) {
      alert("Anna kaikki tarvittavat tiedot.");
      return;
    }

    const incomeId = "income";
    writeIncomeData(year, incomeId, maksaja, summa, maksupvm, tuloluokka, huom); // Call the function to write data
    onClose();
  }

  useEffect(() => {
    if (incomeId !== 0) {
      // Reference to income data in the database
      const incomeRef = ref(mydatabase, "tulot/" + year + "/" + incomeId);
      // Fetch the existing data when the component mounts
      onValue(incomeRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMaksaja(data.maksaja || "");
          setSumma(data.summa || "");
          setMaksupvm(data.maksupvm || "");
          setTuloluokka(data.maksuluokka || "");
          setHuom(data.huom || "");
        }
      });
    }
  }, [incomeId, year]);

  // Delete income entry
  const deleteIncomeItem = (incomeId) => {
    const itemRef = ref(mydatabase, "tulot/" + year + "/" + incomeId);
    remove(itemRef)
      .then(() => {
        console.log("Tulo poistettu");
        emptyValues();
      })
      .catch((error) => {
        console.log("Tulon poisto epäonnistui: ", error);
      });
  };

  // Update income entry
  const handleUpdateIncome = (e) => {
    e.preventDefault();

    // Create an object with the updated fields
    const updatedData = {
      maksaja: maksaja,
      summa: summa,
      maksupvm: maksupvm,
      tuloluokka: tuloluokka,
      huom: huom,
    };

    // Reference to the specific income in the database
    const incomeRef = ref(mydatabase, "tulot/2025/" + incomeId);
    // Update method to update the fields in the database
    update(incomeRef, updatedData)
      .then(() => {
        console.log("Tulon tiedot päivitetty!");
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
            {modalName === "deleteIncome" && <p>Poistetaanko tulo?</p>}
            {modalName === "updateIncome" && <p>Muokkaa tulon tietoja</p>}
            {modalName === "createIncome" && <p>Lisää tulo</p>}
          </Modal.Title>
        </Modal.Header>
        {modalName === "createIncome" && (
          <Modal.Body>
            <Form onSubmit={handleCreateIncome}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Maksaja</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setMaksaja(e.target.value)}
                  placeholder="Maksaja"
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
                <Form.Label>Maksupäivämäärä</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setMaksupvm(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tuloluokka</Form.Label>
                <IncomeCategoryDropDown
                  handleChange={handleIncomeDropdownChange}
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
        {modalName === "deleteIncome" && (
          <Modal.Body>
            <p>
              <b>Maksaja: </b>
              {maksaja}
            </p>
            <p>
              <b>Summa: </b>
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
        {modalName === "updateIncome" && (
          <Modal.Body>
            <Form onSubmit={handleUpdateIncome}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Maksaja</Form.Label>
                <Form.Control
                  type="text"
                  value={maksaja}
                  onChange={(e) => setMaksaja(e.target.value)}
                  placeholder="Maksaja"
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
                <Form.Label>Maksupäivämäärä</Form.Label>
                <Form.Control
                  type="date"
                  value={maksupvm}
                  onChange={(e) => setMaksupvm(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Maksuluokka</Form.Label>
                <IncomeCategoryDropDown
                  value={tuloluokka}
                  handleChange={handleIncomeDropdownChange}
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
          {modalName === "createIncome" && (
            <Button
              variant="success"
              type="submit"
              onClick={handleCreateIncome}
            >
              Lisää
            </Button>
          )}
          {modalName === "deleteIncome" && (
            <Button
              variant="danger"
              type="submit"
              onClick={() => {
                deleteIncomeItem(incomeId);
              }}
            >
              Poista
            </Button>
          )}
          {modalName === "updateIncome" && (
            <Button
              variant="primary"
              type="submit"
              onClick={handleUpdateIncome}
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

export default IncomeCrudModal;

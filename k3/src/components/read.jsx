// React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase
import { ref, onValue } from "firebase/database"; // Realtime Database functions
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
// Bootstrap
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
// Components
import CrudModal from "./crudModal";

const FetchData = () => {
  const [tableArray, setTableArray] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");

  useEffect(() => {
    const dataRef = ref(mydatabase, "menot"); // Define the reference to the data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      //   setData(data); // Set the fetched data to your state
      let tempArray = Object.keys(data).map((invoiceId) => {
        return {
          ...data[invoiceId],
          invoiceId: invoiceId,
        };
      });
      setTableArray(tempArray);
    });
    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  // Modal actions
  const handleShowModal = (id, modalName) => {
    setModalName(modalName);
    setSelectedId(id);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedId(null); // Clear the selected ID
  };

  // Table
  const TableComponent = ({ data }) => {
    if (data) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Saaja</th>
              <th>Summa €</th>
              <th>Eräpäivä</th>
              <th>Maksupäivä</th>
              <th>Maksuluokka</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.saaja}</td>
                <td>{item.summa}</td>
                <td>{item.erapvm}</td>
                <td>{item.maksupvm}</td>
                <td>{item.maksuluokka}</td>
                <td key={item.invoiceId}>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleShowModal(item.invoiceId, "update")}
                  >
                    Muokkaa
                  </Button>
                </td>
                <td>
                  {" "}
                  <Button
                    variant="outline-danger"
                    onClick={() => handleShowModal(item.invoiceId, "delete")}
                  >
                    Poista
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      return <p>Ei laskuja</p>;
    }
  };

  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Maksetut laskut</h3>
        </div>
        <div>
          {tableArray ? (
            <TableComponent data={tableArray} />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
        <div>
          <Button
            variant="outline-success"
            onClick={() => handleShowModal(0, "create")}
          >
            Lisää lasku
          </Button>
        </div>
        <br />
      </Stack>
      <CrudModal
        modalName={modalName}
        id={selectedId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default FetchData;

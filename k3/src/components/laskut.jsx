// React
import React, { useEffect, useState } from "react";
// Firebase
import { getDatabase, ref, onValue } from "firebase/database";
// Bootstrap
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
// Components
import FetchPaginatedData from "./fetchData";
import CrudModal from "./crudModal";

const MaksetutLaskut = () => {
  const [items, setItems] = useState([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Modals
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");

  useEffect(() => {
    FetchPaginatedData(setItems);
  }, []);

  // Pagination items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const renderTableRows = () =>
    currentItems.map((item) => (
      <tr key={item.id}>
        <td>{item.saaja}</td>
        <td>{item.summa}</td>
        <td>{item.erapvm}</td>
        <td>{item.maksupvm}</td>
        <td>{item.maksuluokka}</td>
        <td key={item.id}>
          <Button
            variant="outline-primary"
            onClick={() => handleShowModal(item.id, "update")}
          >
            Muokkaa
          </Button>
        </td>
        <td>
          {" "}
          <Button
            variant="outline-danger"
            onClick={() => handleShowModal(item.id, "delete")}
          >
            Poista
          </Button>
        </td>
      </tr>
    ));

  const renderPagination = () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let itemsArray = [];
    for (let number = 1; number <= totalPages; number++) {
      itemsArray.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{itemsArray}</Pagination>;
  };

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

  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Maksetut laskut</h3>
        </div>
        <div>
          <div>
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
              <tbody>{renderTableRows()}</tbody>
            </Table>
          </div>
        </div>
        <div>
          <Button
            variant="outline-success"
            onClick={() => handleShowModal(0, "create")}
          >
            Lisää lasku
          </Button>
        </div>
        <div>{renderPagination()}</div>
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

export default MaksetutLaskut;
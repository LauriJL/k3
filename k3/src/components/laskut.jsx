// React
import React, { useEffect, useState } from "react";
// Bootstrap
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// Components
import FetchData from "../functions/fetchData";
import CrudModal from "./crudModal";

const MaksetutLaskut = () => {
  const [items, setItems] = useState([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  // Modals
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [year, setYear] = useState("2025");

  useEffect(() => {
    FetchData(setItems, year);
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
        <td>{item.huom}</td>
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

  // Number of items displayed
  const handleItemsPerPage = (event) => {
    setItemsPerPage(event.target.value);
  };

  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Menot</h3>
        </div>
        <Form onChange={handleItemsPerPage}>
          <div>
            {["radio"].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                {"Näytä "}
                <Form.Check
                  inline
                  label="5"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                  value="5"
                />
                <Form.Check
                  inline
                  label="10"
                  name="group1"
                  type={type}
                  id={`inline-${type}-2`}
                  value="10"
                />
                <Form.Check
                  inline
                  label="kaikki"
                  name="group1"
                  type={type}
                  id={`inline-${type}-3`}
                  value="10000"
                />
              </div>
            ))}
          </div>
        </Form>
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
                  <th>Huom</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </Table>
          </div>
        </div>
      </Stack>
      <Stack>
        <Row className="justify-content-md-center">
          <Col xs lg="2"></Col>
          <Col xs lg="2">
            {renderPagination()}
          </Col>
          <Col xs lg="2"></Col>
        </Row>
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

// React
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Bootstrap
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// Components
import FetchFiltered from "../functions/fetchFiltered";
import CrudModal from "./crudModal";

const LaskutLuokittain = () => {
  const { category } = useParams();
  const navigate = useNavigate();
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
    FetchFiltered(category, setItems, year);
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

  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Maksetut laskut - {category} </h3>
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
      <Container className="p-1">
        <Row className="justify-content-md-center">
          <Col xs lg="4">
            <Button variant="secondary" onClick={() => navigate("/totals")}>
              Takaisin
            </Button>
          </Col>
          <Col xs lg="4">
            {renderPagination()}{" "}
          </Col>
          <Col xs lg="4"></Col>
        </Row>
      </Container>
      <CrudModal
        modalName={modalName}
        id={selectedId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default LaskutLuokittain;

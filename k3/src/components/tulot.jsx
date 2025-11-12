// React
import React, { useEffect, useState } from "react";
// Redux
import { useSelector } from "react-redux";
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
import IncomeCrudModal from "./incomeCrudModal";

const Tulot = () => {
  // Redux
  const logged = useSelector((state) => state.auth.logged);
  const selectedYear = useSelector((state) => state.year.selectedYear);
  const needsRefresh = useSelector((state) => state.refresh.needsRefresh);
  // Items
  const [items, setItems] = useState([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  // Modals
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const cat = "tulot";
  // Fetch items when category or selected year changes, or when a refresh is needed
  useEffect(() => {
    FetchData(setItems, cat, selectedYear);
  }, [cat, selectedYear, needsRefresh]);

  // Pagination items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const renderTableRows = () =>
    currentItems.map((item) => (
      <tr key={item.id}>
        <td>{item.maksaja}</td>
        <td>{item.summa}</td>
        <td>{item.maksupvm}</td>
        <td>{item.tuloluokka}</td>
        <td>{item.huom}</td>
        <td key={item.id}>
          <Button
            variant="outline-primary"
            onClick={() => handleShowModal(item.id, "updateIncome")}
          >
            Muokkaa
          </Button>
        </td>
        <td>
          {" "}
          <Button
            variant="outline-danger"
            onClick={() => handleShowModal(item.id, "deleteIncome")}
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
          <h3>Tulot {selectedYear}</h3>
        </div>
        {logged ? (
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
        ) : null}
        <div>
          {logged ? (
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Maksaja</th>
                    <th>Summa €</th>
                    <th>Maksupäivä</th>
                    <th>Tuloluokka</th>
                    <th>Huom</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </Table>
            </div>
          ) : (
            <div>
              <h4>Ei tietoja näytettävänä.</h4>
              <p>Ole hyvä ja kirjaudu sisään.</p>
            </div>
          )}
        </div>
      </Stack>
      <Stack>
        {logged ? (
          <Row className="justify-content-md-center">
            <Col xs lg="2"></Col>
            <Col xs lg="2">
              {renderPagination()}
            </Col>
            <Col xs lg="2"></Col>
          </Row>
        ) : null}
      </Stack>
      <IncomeCrudModal
        modalName={modalName}
        id={selectedId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default Tulot;

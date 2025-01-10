// React
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Bootstrap
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
// Components
import FetchFiltered from "../functions/fetchFiltered";

const LaskutLuokittain = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    FetchFiltered(category, setItems);
  }, []);

  // Table rows
  const renderTableRows = () =>
    items.map((item) => (
      <tr key={item.id}>
        <td>{item.saaja}</td>
        <td>{item.summa}</td>
        <td>{item.erapvm}</td>
        <td>{item.maksupvm}</td>
        <td>{item.maksuluokka}</td>
      </tr>
    ));
  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>{category} - kaikki laskut</h3>
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
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </Table>
          </div>
        </div>
      </Stack>
      <Button variant="secondary" onClick={() => navigate("/totals")}>
        Takaisin
      </Button>
    </Container>
  );
};

export default LaskutLuokittain;

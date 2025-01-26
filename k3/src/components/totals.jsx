// React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Realtime database
import { mydatabase } from "../firebase/firebase_config";
// Bootstrap
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
// Components
import FetchData from "../functions/fetchData";
import calculateCategorySums from "../functions/categorySums";
import LaskutLuokittain from "./invoiceCategory";

const Totals = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [year, setYear] = useState("2025");

  useEffect(() => {
    FetchData(setItems, year);
    // return () => mydatabase.ref("menot").off(); // Cleanup subscription
  }, []);

  const TableComponent = ({ data }) => {
    // Include only invoices that have been paid
    const paidInvoices = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].maksupvm.length > 0) {
        paidInvoices.push(data[i]);
      }
    }

    const reducedData = Object.values(calculateCategorySums(paidInvoices)); // Apply reducer function

    return (
      <Container className="p-5">
        <Stack gap={3}>
          <div>
            <h3>Menot maksuluokittain</h3>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Maksuluokka</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              {reducedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.luokka}</td>
                  <td>{item.summa}</td>
                  <td key={item.id}>
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        navigate(`/laskutluokittain/${item.luokka}`)
                      }
                    >
                      Näytä kaikki
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Container>
    );
  };

  return (
    <div>
      <TableComponent data={items} />
    </div>
  );
};

export default Totals;

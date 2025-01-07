// React
import React, { useEffect, useState } from "react";
// Realtime database
import { mydatabase } from "../firebase/firebase_config";
// Bootstrap
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
// Components
import FetchData from "../functions/fetchData";
import calculateCategorySums from "../functions/categorySums";

const Totals = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    FetchData(setItems);
    console.log(items);
    // return () => mydatabase.ref("menot").off(); // Cleanup subscription
  }, []);

  const TableComponent = ({ data }) => {
    const reducedData = Object.values(calculateCategorySums(data)); // Apply reducer function

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

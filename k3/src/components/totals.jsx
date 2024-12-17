// React
import React, { useEffect, useState } from "react";
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database
import { ref, onValue, query, orderByValue } from "firebase/database";
// Bootstrap
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Components
import FetchData from "../functions/fetchData";
import calculateCatergorySums from "../functions/categorySums";

const Totals = () => {
  let [totalsArray, setTotalsArray] = useState([]);
  const [items, setItems] = useState([]);
  let myArray = [];

  useEffect(() => {
    FetchData(setItems);
    items.map((item) =>
      myArray.push({ maksuluokka: item.maksuluokka, summa: item.summa })
    );
    console.log("MYARRAY: ", myArray);
    const tempArray = calculateCatergorySums(myArray);
    setTotalsArray(tempArray);
  }, []);

  const renderTableRows = () =>
    totalsArray.map((item) => (
      <tr key={item.id}>
        <td>{item.luokka}</td>
        <td>{item.summa}</td>
      </tr>
    ));

  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Kaikki menot</h3>
          <div>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Maksuluokka</th>
                    <th>Yhteensä €</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </Table>
            </div>
          </div>
        </div>
      </Stack>
    </Container>
  );
};

export default Totals;

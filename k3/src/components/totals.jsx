// React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Realtime database
import { mydatabase } from "../firebase/firebase_config";
import { ref, onValue, update } from "firebase/database";
// Bootstrap
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
// Components
import FetchData from "../functions/fetchData";
import calculateCategorySums from "../functions/categorySums";
// Chart components
import { BarChart } from "./barChart";
import { PieChart } from "./pieChart";
import TulevatLaskut from "./tulevatLaskut";

const Totals = () => {
  const [items, setItems] = useState([]);
  const [incomeTotalRaw, setIncomeTotalRaw] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const navigate = useNavigate();
  const catExp = "menot";
  const catInc = "tulot";
  const year = "2025";
  const [expenditureTotal, setExpenditureTotal] = useState(0);
  const [upcomingTotal, setUpcomingTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [pvm, setPvm] = useState("");

  useEffect(() => {
    FetchData(setItems, catExp, year);
    FetchData(setIncomeTotalRaw, catInc, year);
    // return () => mydatabase.ref("menot").off(); // Cleanup subscription
  }, [catExp, catInc, year]);

  // Balance
  useEffect(() => {
    // Reference to income data in the database
    const balanceRef = ref(mydatabase, "saldo/");
    // Fetch the existing data when the component mounts
    onValue(balanceRef, (snapshot) => {
      const data = snapshot.val();
      console.log("data: ", data);
      setBalance(data.saldo);
      setPvm(data.pvm);
    });
  }, []);

  useEffect(() => {
    if (incomeTotalRaw.length > 0) {
      const total = incomeTotalRaw.reduce((accumulator, obj) => {
        return accumulator + parseFloat(obj.summa);
      }, 0);
      setIncomeTotal(total);
    }
  }, [incomeTotalRaw]);

  const TableComponent = ({ data }) => {
    // Include only invoices that have been paid
    const paidInvoices = data.filter((item) => item.maksupvm.length > 0);
    const upcomingInvoices = data.filter((item) => item.maksupvm.length === 0);
    const reducedDataPaid = Object.values(calculateCategorySums(paidInvoices)); // Apply reducer function
    const reducedDataUpcoming = Object.values(
      calculateCategorySums(upcomingInvoices)
    ); // Apply reducer function
    console.log("upcomingInvoices: ", upcomingInvoices);

    setExpenditureTotal(
      reducedDataPaid.reduce(function (accumulator, obj) {
        return accumulator + parseFloat(obj.summa);
      }, 0)
    );

    setUpcomingTotal(
      reducedDataUpcoming.reduce(function (accumulator, obj) {
        return accumulator + parseFloat(obj.summa);
      }, 0)
    );

    return (
      <Container className="p-5">
        <div className="container-fluid-totals">
          <div>
            <h3>Menot maksuluokittain {year}</h3>
          </div>
          <div className="row">
            <div className="col-md-8">
              {" "}
              <Col>
                {" "}
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Maksuluokka</th>
                      <th>Summa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reducedDataPaid.map((item, index) => (
                      <tr key={index}>
                        <td>{item.luokka}</td>
                        <td>{item.summa.toFixed(2)}</td>
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
              </Col>
            </div>
            <div className="col-md-4 d-flex flex-column align-items-top">
              <h4>Saldo: {balance}</h4>
              <h6>Tulot: {incomeTotal.toFixed(2)}</h6>
              <h6>Menot: {expenditureTotal.toFixed(2)}</h6>
              <h6>
                Tulevat menot: {upcomingTotal.toFixed(2)}&nbsp;&nbsp;&nbsp;
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() =>
                    navigate("/tulevatlaskut", {
                      state: { data: upcomingInvoices },
                    })
                  }
                >
                  Näytä
                </Button>
              </h6>

              <h6>Ylijäämä: {(incomeTotal - expenditureTotal).toFixed(2)}</h6>
              <p>Tiedot päivitetty {pvm}</p>
            </div>
          </div>
          <div className="row-bar">
            <div className="col-md-8 d-flex">
              <BarChart
                expenditureTotal={expenditureTotal}
                incomeTotal={incomeTotal}
                diff={incomeTotal - expenditureTotal}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div className="col-md-4 d-flex flex-column align-items-center">
              <Col>
                <PieChart arr={reducedDataPaid} />
              </Col>
            </div>
          </div>
        </div>
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

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
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// Components
import FetchData from "../functions/fetchData";
import calculateCategorySums from "../functions/categorySums";
// Chart components
import { BarChart } from "./barChart";
import { PieChart } from "./pieChart";

const Totals = () => {
  const [items, setItems] = useState([]);
  const [incomeTotalRaw, setIncomeTotalRaw] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const navigate = useNavigate();
  const catExp = "menot";
  const catInc = "tulot";
  const year = "2025";
  const [expenditureTotal, setExpenditureTotal] = useState(0);

  useEffect(() => {
    FetchData(setItems, catExp, year);
    FetchData(setIncomeTotalRaw, catInc, year);
    // return () => mydatabase.ref("menot").off(); // Cleanup subscription
  }, [catExp, catInc, year]);

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
    const reducedData = Object.values(calculateCategorySums(paidInvoices)); // Apply reducer function

    setExpenditureTotal(
      reducedData.reduce(function (accumulator, obj) {
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
            <div className="col-md-6">
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
                    {reducedData.map((item, index) => (
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
            <div className="col-md-6 d-flex flex-column align-items-center">
              <Col>
                <PieChart arr={reducedData} />
              </Col>
            </div>
          </div>
          <div className="row-bar">
            <div className="col-md-12 d-flex">
              <BarChart
                expenditureTotal={expenditureTotal}
                incomeTotal={incomeTotal}
                diff={incomeTotal - expenditureTotal}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
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

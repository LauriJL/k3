// React
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Bootstrap
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Components
import FetchFiltered from "../functions/fetchFiltered";

const LaskutLuokittain = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  console.log("luokka: ", category);
  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Laskuluokka: {category}</h3>
        </div>
      </Stack>
      {/* Render table here automatically when page loads*/}
      <Button variant="primary" onClick={() => FetchFiltered(category)}>
        Hae
      </Button>
      <Button variant="secondary" onClick={() => navigate("/totals")}>
        Takaisin
      </Button>
    </Container>
  );
};

export default LaskutLuokittain;

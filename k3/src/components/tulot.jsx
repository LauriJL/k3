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

const Tulot = () => {
  return (
    <Container className="p-5">
      <Stack gap={3}>
        <div>
          <h3>Tulot</h3>
        </div>
      </Stack>
    </Container>
  );
};

export default Tulot;

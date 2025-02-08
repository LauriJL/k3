// React
import { useNavigate } from "react-router-dom";
// Bootstrap
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <br />
      <br />
      <Row>
        <Stack gap={3} className="col-md-5 mx-auto">
          <Button variant="outline-success" onClick={() => navigate("/login")}>
            Kirjaudu sisään
          </Button>
        </Stack>
      </Row>
    </Container>
  );
};

export default Home;

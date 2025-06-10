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
      <h1 className="text-center">Tervetuloa K3-sovellukseen</h1>
      <p className="text-center">
        K3 on sovellus, jolla voit tarkastella As Oy Kirjokallionkuja 5:n tuloja
        ja menoja.
      </p>
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

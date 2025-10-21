// React
import { useNavigate } from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
// Bootstrap
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

const Home = () => {
  const logged = useSelector((state) => state.auth.logged);
  const email = useSelector((state) => state.email.eMail);
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
      {!logged ? (
        <Row>
          <Stack gap={3} className="col-md-5 mx-auto">
            <p className="text-center">
              Kirjaudu sisään nähdäksesi taloyhtiön tiedot.
            </p>
          </Stack>
        </Row>
      ) : (
        <Row>
          <Stack gap={3} className="col-md-5 mx-auto">
            <h4 className="text-center">
              Olet kirjautunut sisään käyttäjätunnuksella:
            </h4>
            <p className="text-center">{email}</p>
            <Button
              variant="primary"
              onClick={() => navigate("/totals")}
              className="text-center"
            >
              Siirry tarkastelemaan tuloja ja menoja
            </Button>
          </Stack>
        </Row>
      )}
      <br />
    </Container>
  );
};

export default Home;

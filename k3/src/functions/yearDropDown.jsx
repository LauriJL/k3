import Dropdown from "react-bootstrap/Dropdown";

function SetYear() {
  return (
    <Dropdown size="lg">
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Vuosi
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1" active>
          2025
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2">2024</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SetYear;

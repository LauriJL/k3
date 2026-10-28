import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";

test("renders the home page", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  expect(
    screen.getByRole("heading", { name: "Tervetuloa K3-sovellukseen" }),
  ).toBeInTheDocument();
});

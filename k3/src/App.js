import "./App.css";
// React
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState } from "react";
// Components
import FetchData from "./components/read";
import AddData from "./components/create";
import AlertComponent from "./components/alertComponent";

function App() {
  // Alert
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // Show alert
  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  // Hide alert
  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const router = createBrowserRouter([
    {
      path: "/maksetut",
      element: <FetchData triggerAlert={triggerAlert}></FetchData>,
    },
    {
      path: "/lisaa",
      element: <AddData></AddData>,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <AlertComponent
        alertMessage={alertMessage}
        showAlert={showAlert}
        onClose={closeAlert}
      />
    </>
  );
}

export default App;

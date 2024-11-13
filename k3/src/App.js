import "./App.css";
// React
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState } from "react";
// Components
import Home from "./components/home";
import Login from "./components/login";
import FetchData from "./components/read";
import AddData from "./components/create";
import AlertComponent from "./components/alertComponent";
// Context
import { AuthContext } from "./context/authContext";
import { ProtectedRoute } from "./context/protectedRoute";

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
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/maksetut",
      element: (
        <ProtectedRoute>
          <FetchData triggerAlert={triggerAlert} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/lisaa",
      element: (
        <ProtectedRoute>
          <AddData />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <AuthContext>
      <RouterProvider router={router} />
      <AlertComponent
        alertMessage={alertMessage}
        showAlert={showAlert}
        onClose={closeAlert}
      />
    </AuthContext>
  );
}

export default App;

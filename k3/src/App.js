import "./App.css";
// React
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState } from "react";
// Components
import Home from "./components/home";
import Login from "./components/login";
import MaksetutLaskut from "./components/laskut";
import Tulot from "./components/tulot";
import AlertComponent from "./components/alertComponent";
import Totals from "./components/totals";
import LaskutLuokittain from "./components/invoiceCategory";
import DropdownContext from "react-bootstrap/esm/DropdownContext";
// Context
import { AuthContext, Context } from "./context/authContext";
import { ProtectedRoute } from "./context/protectedRoute";
// Idle timer countdown
import CountDown from "./components/countdown";

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
      path: "/totals",
      element: (
        <ProtectedRoute>
          <CountDown></CountDown>
          <Totals triggerAlert={triggerAlert} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/laskut",
      element: (
        <ProtectedRoute>
          <CountDown></CountDown>
          <MaksetutLaskut triggerAlert={triggerAlert} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/tulot",
      element: (
        <ProtectedRoute>
          <CountDown></CountDown>
          <Tulot triggerAlert={triggerAlert} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/laskutluokittain/:category",
      element: (
        <ProtectedRoute>
          <CountDown></CountDown>
          <LaskutLuokittain triggerAlert={triggerAlert} />
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

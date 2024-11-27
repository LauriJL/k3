import "./App.css";
// React
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState } from "react";
// Components
import Home from "./components/home";
import Login from "./components/login";
import MaksetutLaskut from "./components/laskut";
import AlertComponent from "./components/alertComponent";
// Context
import { AuthContext } from "./context/authContext";
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
      path: "/laskut",
      element: (
        <ProtectedRoute>
          <CountDown></CountDown>
          <MaksetutLaskut triggerAlert={triggerAlert} />
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

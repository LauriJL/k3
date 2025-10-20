import "./App.css";

// React
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState } from "react";
// Components
import Home from "./components/home";
import Navbar from "./components/navbar";
import MaksetutLaskut from "./components/laskut";
import Tulot from "./components/tulot";
import AlertComponent from "./components/alertComponent";
import Totals from "./components/totals";
import LaskutLuokittain from "./components/invoiceCategory";
import TulevatLaskut from "./components/tulevatLaskut";

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
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
    {
      path: "/totals",
      element: (
        <>
          <Navbar />
          <CountDown></CountDown>
          <Totals triggerAlert={triggerAlert} />
        </>
      ),
    },
    {
      path: "/laskut",
      element: (
        <>
          <Navbar />
          <CountDown></CountDown>
          <MaksetutLaskut triggerAlert={triggerAlert} />
        </>
      ),
    },
    {
      path: "/tulevatlaskut",
      element: (
        <>
          <Navbar />
          <CountDown></CountDown>
          <TulevatLaskut triggerAlert={triggerAlert} />
        </>
      ),
    },
    {
      path: "/tulot",
      element: (
        <>
          <Navbar />
          <CountDown></CountDown>
          <Tulot triggerAlert={triggerAlert} />
        </>
      ),
    },
    {
      path: "/laskutluokittain/:category",
      element: (
        <>
          <Navbar />
          <CountDown></CountDown>
          <LaskutLuokittain triggerAlert={triggerAlert} />
        </>
      ),
    },
  ]);
  return (
    <>
      {/* Main content */}
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

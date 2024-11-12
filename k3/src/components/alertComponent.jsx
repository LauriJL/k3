// React
import React, { useEffect, useState } from "react";
// Bootstrap
import Alert from "react-bootstrap/Alert";

const AlertComponent = ({ alertMessage, showAlert, onClose }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        onClose(); // Call onClose to hide alert after timeout
      }, 3000);
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [showAlert, onClose]);

  return (
    showAlert && (
      <Alert
        className="alert alert-secondary"
        onClose={() => setShow(false)}
        dismissible
      >
        {alertMessage}
      </Alert>
    )
  );
};

export default AlertComponent;

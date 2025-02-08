// React
import React, { useState, useRef } from "react";
import { IdleTimerProvider } from "react-idle-timer";
// Firebase
import { getAuth, signOut } from "firebase/auth";
// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CountDown() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const idleTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Redirect to login or homepage after logout
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Ulos kirjautuminen epäonnistui:", error);
      });
  };

  const handleOnIdle = () => {
    setIsModalOpen(true);
    setCountdown(15);
    idleTimerRef.current?.pause(); // Pause the idle timer

    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      console.log("Countdown started");
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownIntervalRef.current);
          handleLogout(); // Auto-logout if countdown reaches zero
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleOnActive = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
      clearInterval(countdownIntervalRef.current); // Stop the countdown
    }
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    idleTimerRef.current?.reset(); // Reset the idle timer
    clearInterval(countdownIntervalRef.current);
    // alert("You have been logged out due to inactivity.");
    logoutUser();
  };

  const handleResetTimer = () => {
    setIsModalOpen(false);
    idleTimerRef.current?.reset(); // Reset the idle timer
    idleTimerRef.current?.resume(); // Resume idle detection
    clearInterval(countdownIntervalRef.current);
  };

  return (
    <IdleTimerProvider
      ref={idleTimerRef}
      timeout={1 * 60 * 1000} // 5 minutes
      onIdle={handleOnIdle}
      onActive={handleOnActive}
      debounce={250}
    >
      <div>
        {/* Bootstrap Modal */}
        <Modal
          show={isModalOpen}
          onHide={handleLogout}
          data-bs-backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Uloskirjautuminen....</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Sinut kirjataan ulos sovelluksesta {countdown} sekunnin päästä.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleResetTimer}>
              Älä kirjaa ulos
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Kirjaudu ulos heti
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </IdleTimerProvider>
  );
}

export default CountDown;

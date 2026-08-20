import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { auth } from "../firebase/firebase_config";
import buildChatContext from "../functions/buildChatContext";
import sendChatMessage from "../functions/sendChatMessage";
import "./KirjoBot.css";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hei! Olen KirjoBot. Voin vastata kysymyksiin taloyhtiön taloustiedoista, kaupparekisteriotteesta ja yhtiöjärjestyksestä.",
};

const KirjoBot = () => {
  const logged = useSelector((state) => state.auth.logged);
  const selectedYear = useSelector((state) => state.year.selectedYear);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const resetChat = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setLoading(false);
    setError("");
  }, []);

  const closeChat = useCallback(() => {
    resetChat();
    setOpen(false);
  }, [resetChat]);

  useEffect(() => {
    if (!logged) {
      resetChat();
      setOpen(false);
    }
  }, [logged, resetChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError("");
    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Kirjautuminen vaaditaan.");
      }

      const idToken = await user.getIdToken();
      const dbContext = await buildChatContext(selectedYear);

      const chatHistory = updatedMessages
        .slice(1)
        .map(({ role, content }) => ({ role, content }));

      const reply = await sendChatMessage(
        chatHistory,
        dbContext,
        idToken,
        controller.signal
      );

      if (controller.signal.aborted) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Viestin lähetys epäonnistui.");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  if (!logged) {
    return null;
  }

  return (
    <>
      <button
        className="kirjobot-bubble"
        onClick={() => (open ? closeChat() : setOpen(true))}
        aria-label={open ? "Sulje KirjoBot-chat" : "Avaa KirjoBot-chat"}
      >
        KirjoBot
      </button>

      {open && (
        <div className="kirjobot-panel">
          <div className="kirjobot-header">
            <span>KirjoBot</span>
            <button
              className="kirjobot-close"
              onClick={closeChat}
              aria-label="Sulje chat"
            >
              ×
            </button>
          </div>

          <div className="kirjobot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`kirjobot-message ${msg.role}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="kirjobot-loading">
                <Spinner animation="border" size="sm" /> KirjoBot kirjoittaa...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && <div className="kirjobot-error">{error}</div>}

          <form className="kirjobot-input-area" onSubmit={handleSend}>
            <Form.Control
              type="text"
              placeholder="Kysy taloustiedoista..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
              Lähetä
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default KirjoBot;

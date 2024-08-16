import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../config";
import io from "socket.io-client";
const socket = io(`${API_URL}`);
const Chat = () => {
  const username = localStorage.getItem("username");
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      username: "Admin",
      message: `Hello ${username}, Enjoy your time chatting...`,
    },
  ]);

  useEffect(() => {
    socket.on("chat message", ({ username, message }) => {
      setMessages((prevMessages) => [...prevMessages, { username, message }]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.on("user count", (count) => {
      setUserCount(count);
    });

    return () => {
      socket.off("user count");
    };
  }, [messages]);

  const sendMessage = () => {
    socket.emit("chat message", { username, message });
    setMessage("");
  };

  return (
    <div
      className="main-content only-for-chat"
      style={{ behavior: "smooth", overflow: "auto" }}
    >
      <div className="chat-title">Global Chat</div>{" "}
      <div style={{ color: "green" }}>{userCount} online</div>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              className={`chat-user-message ${
                username === msg.username ? "right" : "left"
              }`}
              key={index}
            >
              <div className="user-name">
                {username === msg.username ? username : msg.username}
              </div>
              <div className="user-msg">{msg.message}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="send-message-container" onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Aa"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

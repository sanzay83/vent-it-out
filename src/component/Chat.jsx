import React, { useEffect, useState } from "react";
//import { API_URL } from "../config";
//import io from "socket.io-client";
// const socket = io(`${API_URL}`);
const Chat = () => {
  const username = localStorage.getItem("username");
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { username: "Sanjay", message: "This is a sample text message." },
    { username: "Sanjay Duwal", message: "This is a sample text message." },
    { username: "Sanjay", message: "This is a sample text message." },
    { username: "Sanjay Duwal", message: "This is a sample text message." },
  ]);

  // useEffect(() => {
  //   socket.on("chat message", ({ username, message }) => {
  //     setMessages((prevMessages) => [...prevMessages, { username, message }]);
  //   });

  //   return () => {
  //     socket.off("chat message");
  //   };
  // }, []);

  // useEffect(() => {
  //   socket.on("user count", (count) => {
  //     setUserCount(count);
  //   });

  //   return () => {
  //     socket.off("user count");
  //   };
  // }, [messages]);

  const sendMessage = () => {
    //socket.emit("chat message", { username, message });
    setMessage("");
  };

  return (
    <div className="main-content only-for-chat">
      <div className="chat-title">Global Chat</div>{" "}
      <div style={{ color: "green" }}>{userCount} online</div>
      Currently this page is development phase.
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              className={`chat-user-message ${
                username === msg.username ? "right" : "left"
              }`}
              key={index}
            >
              <div className="user-msg">
                {username === msg.username ? username : msg.username}
              </div>
              <div className="user-msg">{msg.message}</div>
            </div>
          ))}
        </div>
        <div onSubmit={sendMessage}>
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

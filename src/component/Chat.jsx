import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
const socket = io(`${API_URL}`);

const Chat = () => {
  const username = localStorage.getItem("username");
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/vio/messages`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
        const messages = response.data.reverse();
        setMessages(messages);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

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

  const sendMessage = async () => {
    socket.emit("chat message", { username, message });
    setMessage("");

    try {
      await axios.post(
        `${API_URL}/vio/messages`,
        {
          username,
          message,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLink = (username) => {
    if (username !== "Admin") {
      navigate("/userposts", { state: { username: username } });
    }
  };

  return (
    <div
      className="main-content only-for-chat"
      style={{ behavior: "smooth", overflow: "auto" }}
    >
      <div className="chat-title">Global Chat</div>{" "}
      <div style={{ color: "green" }}>{userCount} online</div>
      <div className="messages-container">
        {loading ? (
          "Loading Messages"
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index}>
                {username === msg.username ? (
                  <div className="user-message-container chat-right">
                    <div className="chat-user-name">{username}</div>
                    <div
                      className="chat-user-msg "
                      style={{ backgroundColor: "#003108" }}
                    >
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div className="user-message-container chat-left">
                    <div
                      className="chat-user-name"
                      onClick={() => handleLink(msg.username)}
                    >
                      {msg.username}
                    </div>
                    <div
                      className="chat-user-msg"
                      style={{ backgroundColor: "#3c096c" }}
                    >
                      {msg.message}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="send-message-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Aa"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

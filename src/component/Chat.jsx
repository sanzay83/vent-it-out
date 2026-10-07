import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(200);
        if (error) throw error;
        setMessages(data || []);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    // Realtime: new messages stream in + presence tracks who's online.
    const channel = supabase
      .channel("global-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setUserCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ username });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;
    setMessage("");

    try {
      const { error } = await supabase
        .from("messages")
        .insert({ username, message: text });
      if (error) throw error;
      // The realtime INSERT subscription above appends it to the list —
      // no need to add it locally (avoids duplicates).
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
    <div className="main-content only-for-chat">
      <div className="chat-head">
        <h1 className="chat-title">Global Chat</h1>
        <span className="chat-online">
          <span className="dot" />
          {userCount} online
        </span>
      </div>
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
                    <div className="chat-user-msg">{msg.message}</div>
                  </div>
                ) : (
                  <div className="user-message-container chat-left">
                    <div
                      className="chat-user-name"
                      onClick={() => handleLink(msg.username)}
                    >
                      {msg.username}
                    </div>
                    <div className="chat-user-msg">{msg.message}</div>
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
          placeholder="Type a message..."
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

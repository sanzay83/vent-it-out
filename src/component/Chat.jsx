import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipsesSharp, IoChatbubblesOutline } from "react-icons/io5";
import { supabase } from "../supabaseClient";
import Loader from "./Loader";

const timeLabel = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const dayLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yest)) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

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

  const handleLink = (name) => {
    if (name !== "Admin") {
      navigate("/userposts", { state: { username: name } });
    }
  };

  return (
    <div className="main-content only-for-chat">
      <div className="chat-card">
        <div className="chat-head">
          <div className="chat-head-left">
            <span className="chat-head-icon">
              <IoChatbubbleEllipsesSharp />
            </span>
            <div>
              <h1 className="chat-title">Global Chat</h1>
              <p className="chat-subtitle">Everyone's invited · be kind</p>
            </div>
          </div>
          <span className="chat-online">
            <span className="dot" />
            {userCount} online
          </span>
        </div>

        <div className="messages-container">
          {loading ? (
            <div className="chat-loading">
              <Loader />
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <span className="chat-empty-icon">
                <IoChatbubblesOutline />
              </span>
              <p className="chat-empty-title">It's quiet here</p>
              <p className="chat-empty-sub">
                Be the first to say hello.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const mine = username === msg.username;
              const prev = messages[index - 1];
              const grouped = !!prev && prev.username === msg.username;
              const day = dayLabel(msg.created_at);
              const prevDay = prev ? dayLabel(prev.created_at) : null;
              return (
                <React.Fragment key={msg.id ?? index}>
                  {day !== prevDay && (
                    <div className="chat-day">
                      <span>{day}</span>
                    </div>
                  )}
                  <div
                    className={`msg-row ${mine ? "mine" : "theirs"}${
                      grouped ? " grouped" : ""
                    }`}
                  >
                    {!mine && (
                      <span className="msg-avatar" aria-hidden="true">
                        {grouped ? "" : msg.username.charAt(0)}
                      </span>
                    )}
                    <div className="msg-body">
                      {!mine && !grouped && (
                        <div
                          className="msg-name"
                          onClick={() => handleLink(msg.username)}
                        >
                          {msg.username}
                        </div>
                      )}
                      <div className="msg-line">
                        <div className="msg-bubble">{msg.message}</div>
                        <span className="msg-time">
                          {timeLabel(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-composer">
          <div className="composer-box">
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
      </div>
    </div>
  );
};

export default Chat;

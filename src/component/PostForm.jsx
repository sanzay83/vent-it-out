import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const PostForm = () => {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [message, setMessage] = useState("");
  const [reaction, setReaction] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    const newDate = new Date();
    setDatetime(newDate);
    setReaction(0);
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      if (!title && !message) {
      }
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/vio/posts`,
        {
          username,
          title,
          datetime,
          message,
          reaction,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/");
    } catch (error) {
      setError("Make sure you are Signed In, Title and Message is not empty.");
    }
  };

  return (
    <div className="container signin-container">
      <div className="signin-box">
        <form onSubmit={handlePost}>
          <div className="title">Post</div>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <textarea
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />

          <button type="submit">Add Post</button>
        </form>
        {error ? `${error}` : ""}
      </div>
    </div>
  );
};

export default PostForm;

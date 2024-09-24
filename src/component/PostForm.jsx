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
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const buttonType = ["Happy", "Sad", "Angry", "Love", "Surprise", "Relaxed"];
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    const newDate = new Date();
    setDatetime(newDate);
    setReaction(0);
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      if (title && message && type) {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.post(`${API_URL}/vio/posts`, {
            username,
            title,
            datetime,
            message,
            reaction,
            type,
          });
        }
        navigate("/");
      } else {
        alert("Please add title, message and select your mood!");
      }
    } catch (error) {
      setError("Make sure you are Signed In, Title and Message is not empty.");
    }
  };
  const handleButton = (selectedType) => {
    setType(selectedType);
  };

  return (
    <div className="main-content">
      <div className="posting-box">
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

        {buttonType.map((btn, index) => (
          <button
            className={`type-button ${btn} ${type === btn ? "active" : ""}`}
            onClick={() => handleButton(btn)}
            key={index}
          >
            {btn}
          </button>
        ))}
        <button type="submit" onClick={handlePost}>
          Add Post
        </button>
        {error ? `${error}` : ""}
      </div>
    </div>
  );
};

export default PostForm;

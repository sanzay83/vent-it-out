import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Emoji from "./Emoji";

const PostForm = () => {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const buttonType = ["Happy", "Sad", "Angry", "Love", "Surprise", "Relaxed"];
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      if (title && message && type) {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please sign in to post.");
          return;
        }
        const { error } = await supabase.from("posts").insert({
          username,
          title,
          message,
          type,
        });
        if (error) throw error;
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
      <div className="composer-card">
        <div className="title">Let it out</div>
        <p className="composer-sub">
          Nobody knows it's you. Say what you really feel — pick the mood that
          fits.
        </p>

        <div className="composer-field">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your vent a headline..."
            maxLength={120}
          />
        </div>

        <div className="composer-field">
          <label htmlFor="message">What's on your mind?</label>
          <textarea
            id="message"
            className="field-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Pour it all out. No judgment here."
          />
        </div>

        <div className="composer-field">
          <label>How are you feeling?</label>
          <div className="mood-grid">
            {buttonType.map((btn, index) => (
              <button
                type="button"
                data-mood={btn}
                className={`mood-chip-btn ${type === btn ? "active" : ""}`}
                onClick={() => handleButton(btn)}
                key={index}
              >
                <Emoji type={btn} />
                {btn}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary composer-submit"
          onClick={handlePost}
        >
          Release it
        </button>
        {error ? <div className="composer-error">{error}</div> : ""}
      </div>
    </div>
  );
};

export default PostForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setShowMessage("Missing username or Password");
      return;
    } else if (username < 5 || password.length < 8) {
      setShowMessage(
        "Username must be atleast 5 character and Password 8 characters long."
      );
      return;
    }

    try {
      await axios.post(`${API_URL}/vio/register`, {
        username,
        password,
      });
      localStorage.setItem("registered", true);
      navigate("/signin");
    } catch (error) {
      setShowMessage(error.response.data.message);
    }
  };

  const handleCreate = () => {
    navigate("/signin");
  };

  return (
    <div className="main-content">
      <div className="auth-wrap">
        <div className="signin-box">
          <div className="title">Join the circle</div>
          <p className="auth-sub">
            Create an anonymous identity and start letting it out.
          </p>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
            />

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password (8+ characters)"
              autoComplete="new-password"
            />
            <button type="submit">Create account</button>
          </form>
          <div className="account-create" onClick={handleCreate}>
            Already have an account? <b>Sign in</b>
          </div>
          {showMessage ? <div className="auth-message">{showMessage}</div> : ""}
        </div>
      </div>
    </div>
  );
};

export default Register;

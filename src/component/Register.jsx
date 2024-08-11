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
    <div className="container signin-container">
      <div className="signin-box">
        <form onSubmit={handleRegister}>
          <div className="title">Register</div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter New Username"
          />

          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New Password"
          />
          <button type="submit">Register</button>
          <div className="account-create" onClick={handleCreate}>
            Go back to sign in page.
          </div>
        </form>
        {showMessage ? `${showMessage}` : ""}
      </div>
    </div>
  );
};

export default Register;

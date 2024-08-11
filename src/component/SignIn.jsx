import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/vio/login`, {
        username,
        password,
      });
      localStorage.setItem("username", username);
      localStorage.setItem("token", response.data.access);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = () => {
    setShowMessage(!showMessage);
  };
  return (
    <div className="container signin-container">
      <div className="signin-box">
        <form onSubmit={handleSignIn}>
          <div className="title">Sign In</div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className="forget">Forget password?</div>
          <button type="submit">Login</button>
          <div className="account-create" onClick={handleCreate}>
            Don't have an account? Create
          </div>
          {showMessage
            ? "Haha, Developer is working hard right now to let you register to site. Please use username as 'user' and password as 'admin' for now to login."
            : ""}
        </form>
      </div>
    </div>
  );
};

export default SignIn;

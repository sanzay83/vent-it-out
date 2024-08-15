import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setShowMessage("Missing username or Password");
      return;
    } else if (password.length < 8) {
      setShowMessage("Password must be 8 character long.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/vio/login`, {
        username,
        password,
      });
      localStorage.setItem("username", username);
      localStorage.setItem("token", response.data.access);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate("/register");
  };

  return (
    <div className="main-content">
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
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
            {/* <div className="forget">Forget password?</div> */}
            <button type="submit">Login</button>
            <div className="account-create" onClick={handleCreate}>
              Don't have an account? <b>Create</b>
            </div>
          </form>
          {showMessage ? `${showMessage}` : ""}
        </div>
      )}
    </div>
  );
};

export default SignIn;

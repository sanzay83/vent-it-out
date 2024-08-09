import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await axios.post("", {
        username,
        password,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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
          />

          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forget">Forget password?</div>
          <button type="submit">Login</button>
          <div className="">Don't have an account? Create</div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

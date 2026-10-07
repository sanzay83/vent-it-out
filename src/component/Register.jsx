import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setShowMessage("Missing username, email or password");
      return;
    } else if (username.length < 5 || password.length < 8) {
      setShowMessage(
        "Username must be atleast 5 character and Password 8 characters long."
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username,
      });
      if (profileError) {
        // Username taken (or another profile issue) — clean up the auth user
        // record attempt so the message is clear.
        throw new Error(
          profileError.code === "23505"
            ? "That username is taken — pick another."
            : profileError.message
        );
      }

      localStorage.setItem("registered", true);
      navigate("/signin");
    } catch (error) {
      setShowMessage(error.message);
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
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
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

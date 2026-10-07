import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Loader from "./Loader";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShowMessage("Missing email or password");
      return;
    } else if (password.length < 8) {
      setShowMessage("Password must be 8 character long.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();
      if (profileError) throw profileError;

      localStorage.setItem("username", profile.username);
      localStorage.setItem("token", data.session.access_token);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setShowMessage("Sign in failed. Check your email and password.");
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
        <div className="auth-wrap">
          <div className="signin-box">
            <div className="title">Welcome back</div>
            <p className="auth-sub">
              Sign in to vent, react, and join the conversation.
            </p>
            <form onSubmit={handleSignIn}>
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
                placeholder="Password"
                autoComplete="current-password"
              />
              <button type="submit">Sign in</button>
            </form>
            <div className="account-create" onClick={handleCreate}>
              Don't have an account? <b>Create one</b>
            </div>
            {showMessage ? (
              <div className="auth-message">{showMessage}</div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;

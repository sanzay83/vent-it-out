import React from "react";
import { useNavigate } from "react-router-dom";
import { MdNightsStay } from "react-icons/md";
import { IoSunny, IoAdd } from "react-icons/io5";
import { supabase } from "../supabaseClient";
import logo from "../assets/viologo.png";

const Header = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLink = (link) => {
    navigate("/" + link);
  };

  const handleIsDark = () => {
    const theme = localStorage.getItem("theme");
    if (!theme || theme === "light") {
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else if (theme === "dark") {
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand" onClick={() => handleLink("")}>
          <img src={logo} className="header-logo" alt="Vent It Out logo" />
          <span className="header-title">Vent It Out</span>
        </div>

        <nav className="header-nav">
          <div className="header-nav-item" onClick={() => handleLink("")}>
            Home
          </div>
          {token ? (
            <>
              <div
                className="header-nav-item"
                onClick={() => handleLink("myposts")}
              >
                My Posts
              </div>
              <div className="header-nav-item" onClick={() => handleLink("chat")}>
                Chat
              </div>
            </>
          ) : null}
          <div className="header-nav-item" onClick={() => handleLink("about")}>
            About
          </div>
        </nav>

        <div className="header-actions">
          <button className="header-cta" onClick={() => handleLink("postform")}>
            <IoAdd /> New vent
          </button>
          {token && username ? (
            <div className="header-user" title={username}>
              <span className="avatar-dot">{username.charAt(0)}</span>
              <span className="uname">{username}</span>
            </div>
          ) : null}
          <button
            className="theme-toggle"
            onClick={handleIsDark}
            aria-label="Toggle theme"
            title="Toggle light / dark mode"
          >
            {isDark ? <MdNightsStay size="1.15rem" /> : <IoSunny size="1.15rem" />}
          </button>
          {token ? (
            <button className="header-auth-btn" onClick={handleSignOut}>
              Sign out
            </button>
          ) : (
            <button
              className="header-auth-btn solid"
              onClick={() => handleLink("signin")}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

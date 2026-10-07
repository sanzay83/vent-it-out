import React, { useState } from "react";
import {
  IoHome,
  IoHomeOutline,
  IoAdd,
  IoChatbubbleEllipsesSharp,
  IoChatbubbleEllipsesOutline,
  IoMenu,
  IoSunnyOutline,
  IoInformationCircleOutline,
  IoLogOutOutline,
  IoLogInOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { MdNightsStay } from "react-icons/md";
import { BsPostcard, BsPostcardFill } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Footer({ isDark, setIsDark }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const path = location.pathname.replace(/\/$/, "") || "/";

  const protectedRoutes = ["chat", "myposts", "postform"];

  const handleLink = (link) => {
    if (!token && protectedRoutes.includes(link)) {
      navigate("/signin");
    } else {
      navigate("/" + link);
    }
    setShowMenu(false);
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
    setShowMenu(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setShowMenu(false);
    navigate("/");
  };

  const isActive = (route) => ("/" + route).replace(/\/$/, "") === path;

  return (
    <div className="tabbar-wrap">
      {showMenu && (
        <div className="tabbar-scrim" onClick={() => setShowMenu(false)} />
      )}
      {showMenu && (
        <div className="tabbar-sheet">
          <button className="tabbar-sheet-item" onClick={handleIsDark}>
            {isDark ? <MdNightsStay /> : <IoSunnyOutline />}
            {isDark ? "Dark mode" : "Light mode"}
          </button>
          <button
            className="tabbar-sheet-item"
            onClick={() => handleLink("about")}
          >
            <IoInformationCircleOutline />
            About
          </button>
          {token ? (
            <>
              <button
                className="tabbar-sheet-item"
                onClick={() => handleLink("account")}
              >
                <IoPersonCircleOutline />
                Manage account
              </button>
              <button className="tabbar-sheet-item" onClick={handleSignOut}>
                <IoLogOutOutline />
                Sign out
              </button>
            </>
          ) : (
            <button
              className="tabbar-sheet-item"
              onClick={() => handleLink("signin")}
            >
              <IoLogInOutline />
              Sign in
            </button>
          )}
        </div>
      )}
      <nav className="tabbar">
        <button
          className={`tabbar-btn ${isActive("") ? "active" : ""}`}
          onClick={() => handleLink("")}
        >
          {isActive("") ? <IoHome /> : <IoHomeOutline />}
          Home
        </button>
        <button
          className={`tabbar-btn ${isActive("myposts") ? "active" : ""}`}
          onClick={() => handleLink("myposts")}
        >
          {isActive("myposts") ? <BsPostcardFill /> : <BsPostcard />}
          My Posts
        </button>
        <button
          className="tabbar-add"
          onClick={() => handleLink("postform")}
          aria-label="New post"
        >
          <IoAdd />
        </button>
        <button
          className={`tabbar-btn ${isActive("chat") ? "active" : ""}`}
          onClick={() => handleLink("chat")}
        >
          {isActive("chat") ? (
            <IoChatbubbleEllipsesSharp />
          ) : (
            <IoChatbubbleEllipsesOutline />
          )}
          Chat
        </button>
        <button
          className={`tabbar-btn ${showMenu ? "active" : ""}`}
          onClick={() => setShowMenu(!showMenu)}
        >
          <IoMenu />
          Menu
        </button>
      </nav>
    </div>
  );
}

export default Footer;

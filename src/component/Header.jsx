import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNightsStay } from "react-icons/md";
import { IoSunny } from "react-icons/io5";

const Header = ({ isDark, setIsDark }) => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useNavigate();

  const handleLink = (link) => {
    setShowMenu(!showMenu);
    location("/" + link);
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

  const handleSignOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setShowMenu(!showMenu);
    location("/");
  };

  return (
    <>
      <div className="header">
        <div className="header-title" onClick={() => handleLink("")}>
          Vent It Out
        </div>
      </div>

      {/* <aside></> */}

      <div className="aside aside-left">
        <div className="menu-item" onClick={() => handleLink("")}>
          Home
        </div>
        {localStorage.getItem("token") ? (
          <>
            <div className="menu-item" onClick={() => handleLink("myposts")}>
              MyPosts
            </div>
            <div className="menu-item" onClick={() => handleLink("chat")}>
              Chat
            </div>
          </>
        ) : (
          ""
        )}

        <div className="menu-item" onClick={() => handleLink("about")}>
          About
        </div>
      </div>

      <div className="aside aside-right">
        <div
          className="menu-item"
          onClick={() => {
            handleIsDark();
          }}
        >
          Mode:{" "}
          {isDark ? (
            <MdNightsStay size={"1.5rem"} color="white" />
          ) : (
            <IoSunny size={"1.5rem"} color="yellow" />
          )}
        </div>
        {localStorage.getItem("token") ? (
          <>
            <div className="menu-item" onClick={() => handleSignOut()}>
              SignOut
            </div>
          </>
        ) : (
          <div className="menu-item" onClick={() => handleLink("signin")}>
            SignIn
          </div>
        )}
      </div>
    </>
  );
};

export default Header;

import React, { useState } from "react";
import { IoSunny } from "react-icons/io5";
import { MdNightsStay } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Header = ({ isDark, setIsDark }) => {
  const [showMenu, setShowMenu] = useState(false);

  const location = useNavigate();

  const handleLink = (link) => {
    setShowMenu(!showMenu);
    location("/" + link);
  };

  const handleSignOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setShowMenu(!showMenu);
    location("/");
  };

  const handleIsDark = () => {
    setShowMenu(!showMenu);
    const theme = localStorage.getItem("theme");
    if (!theme || theme === "light") {
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else if (theme === "dark") {
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-title" onClick={() => handleLink("")}>
          Vent It Out
        </div>
        <div className="dark-button-container">
          <div
            className={`dark-mode-button `}
            onClick={() => {
              handleIsDark();
            }}
          >
            {isDark ? (
              <div className="on">
                <MdNightsStay size={"1.5rem"} color="white" />
              </div>
            ) : (
              <div className="off">
                <IoSunny size={"1.5rem"} color="yellow" />
              </div>
            )}
          </div>
        </div>

        {/* Nav Bar */}

        <div className="nav-bar nav-hide">
          <div className="nav-item" onClick={() => handleLink("")}>
            Home
          </div>
          {localStorage.getItem("token") ? (
            <>
              <div className="nav-item" onClick={() => handleLink("myposts")}>
                MyPosts
              </div>
              <div className="nav-item" onClick={() => handleLink("chat")}>
                Chat
              </div>{" "}
            </>
          ) : (
            ""
          )}
          <div className="nav-item" onClick={() => handleLink("about")}>
            About
          </div>
        </div>
        <div className="nav-bar nav-bar-end">
          {localStorage.getItem("token") ? (
            <>
              <div className="nav-item" onClick={() => handleSignOut()}>
                SignOut
              </div>
            </>
          ) : (
            <div className="nav-item" onClick={() => handleLink("signin")}>
              SignIn
            </div>
          )}
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
    </>
  );
};

export default Header;

import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = ({ isDark, setIsDark }) => {
  const [showMenu, setShowMenu] = useState(false);

  const location = useNavigate();
  const handleHamburger = () => {
    setShowMenu(!showMenu);
  };

  const handleLink = (link) => {
    setShowMenu(!showMenu);
    location("/" + link);
  };

  const handleSignOut = () => {
    localStorage.clear();
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
      <div className="header largerscreen">
        <div className="header-title">Vent It Out</div>
        <div className="header-hamburger-menu largerscreenhamburger">
          <div onClick={handleHamburger}>
            {showMenu ? <IoCloseSharp /> : <GiHamburgerMenu />}
          </div>
        </div>

        <div
          className={`hamburger-menu-items largerscreenhamburger ${
            showMenu ? "" : "menu-disabled"
          }`}
        >
          {isDark ? (
            <div className="menu-item" onClick={() => handleIsDark()}>
              Dark Off
            </div>
          ) : (
            <div className="menu-item" onClick={() => handleIsDark()}>
              Dark On
            </div>
          )}
          {localStorage.getItem("token") ? (
            <>
              <div className="menu-item" onClick={() => handleSignOut()}>
                Sign Out
              </div>
              <div className="menu-item" onClick={() => handleLink("myposts")}>
                MyPosts
              </div>
              <div className="menu-item" onClick={() => handleLink("chat")}>
                Chat
              </div>
            </>
          ) : (
            <div className="menu-item" onClick={() => handleLink("signin")}>
              Sign In
            </div>
          )}

          <div className="menu-item" onClick={() => handleLink("")}>
            Home
          </div>

          <div className="menu-item" onClick={() => handleLink("about")}>
            About
          </div>
        </div>
      </div>

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
        {isDark ? (
          <div className="menu-item" onClick={() => handleIsDark()}>
            Dark Off
          </div>
        ) : (
          <div className="menu-item" onClick={() => handleIsDark()}>
            Dark On
          </div>
        )}
        {localStorage.getItem("token") ? (
          <>
            <div className="menu-item" onClick={() => handleSignOut()}>
              Sign Out
            </div>
          </>
        ) : (
          <div className="menu-item" onClick={() => handleLink("signin")}>
            Sign In
          </div>
        )}
      </div>
    </>
  );
};

export default Header;

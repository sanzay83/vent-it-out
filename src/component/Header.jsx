import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = () => {
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

  return (
    <>
      <div className="container header">
        <div className="header-title">Vent It Out</div>
        <div className="header-hamburger-menu">
          <div onClick={handleHamburger}>
            {showMenu ? <IoCloseSharp /> : <GiHamburgerMenu />}
          </div>
        </div>

        <div
          className={`hamburger-menu-items ${showMenu ? "" : "menu-disabled"}`}
        >
          {localStorage.getItem("token") ? (
            <div className="menu-item" onClick={() => handleSignOut()}>
              Sign Out
            </div>
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
    </>
  );
};

export default Header;

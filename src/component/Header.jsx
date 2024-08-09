import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleHamburger = () => {
    setShowMenu(!showMenu);
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
      </div>
      {showMenu ? (
        <div className="container menu">
          <div className="hamburger-menu-items">
            <div className="menu-item">Sign in</div>
            <div className="menu-item">Home</div>
            <div className="menu-item">About</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Header;

import React, { useState } from "react";
import {
  IoHome,
  IoAddCircle,
  IoChatbubbleEllipsesSharp,
  IoSettingsSharp,
  IoSunny,
} from "react-icons/io5";
import { MdNightsStay } from "react-icons/md";

import { BsFillPostcardFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Footer({ isDark, setIsDark }) {
  const user = localStorage.getItem("username");
  const location = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLink = (link) => {
    if (
      user === true &&
      (link === "chat" || link === "myposts" || link === "postform")
    ) {
      location("/" + link);
    } else if (
      !user === true &&
      (link === "chat" || link === "myposts" || link === "postform")
    ) {
      location("/signin");
    } else {
      location("/" + link);
    }
    if (showMenu) {
      setShowMenu(!showMenu);
    }
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
      <div
        className={`footer ${isDark ? "darkthemefooter" : "lightthemefooter"}`}
      >
        <div className="item1" onClick={() => handleLink("")}>
          <IoHome />
        </div>
        <div className="item2" onClick={() => handleLink("myposts")}>
          <BsFillPostcardFill />
        </div>
        <div className="item3" onClick={() => handleLink("postform")}>
          <IoAddCircle />
        </div>
        <div className="item4" onClick={() => handleLink("chat")}>
          <IoChatbubbleEllipsesSharp />
        </div>
        <div className="item5">
          <IoSettingsSharp />
          <div
            className={`footer-menu ${
              isDark ? "darkthemefooter" : "lightthemefootermenu"
            }`}
          >
            <div className="footer-menu-item">
              <div
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
            </div>
            {localStorage.getItem("token") ? (
              <>
                <div
                  className="footer-menu-item"
                  onClick={() => handleSignOut()}
                >
                  SignOut
                </div>
              </>
            ) : (
              <div
                className="footer-menu-item"
                onClick={() => handleLink("signin")}
              >
                SignIn
              </div>
            )}
            <div
              className="footer-menu-item"
              onClick={() => handleLink("about")}
            >
              About
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;

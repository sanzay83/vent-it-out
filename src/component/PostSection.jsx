import React from "react";
import { useNavigate } from "react-router-dom";

const PostSection = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  const handlePostSection = () => {
    if (localStorage.getItem("username")) {
      navigate("/postform");
    } else {
      navigate("/signin");
    }
  };
  return (
    <div className="container input-section">
      {user ? (
        <div style={{ fontSize: "1.5em", paddingLeft: "1em" }}>
          Hello, {user}
        </div>
      ) : (
        ""
      )}
      <div className="whatsonyourmind" onClick={handlePostSection}>
        What's on your mind?
      </div>
    </div>
  );
};

export default PostSection;

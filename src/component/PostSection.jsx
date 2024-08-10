import React from "react";
import { useNavigate } from "react-router-dom";

const PostSection = () => {
  const navigate = useNavigate();

  const handlePostSection = () => {
    if (localStorage.getItem("username")) {
      navigate("/postform");
    } else {
      navigate("/signin");
    }
  };
  return (
    <div className="container input-section">
      <div>Hello, {localStorage.getItem("username")}</div>
      <div className="input-box" onClick={handlePostSection}>
        What's on your mind?
      </div>
    </div>
  );
};

export default PostSection;

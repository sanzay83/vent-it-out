import React, { useLayoutEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [noPostMessage, setNoPostMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { username } = location.state;

  useLayoutEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post(`${API_URL}/vio/posts/userpost`, {
          username,
        });
        const posts = response.data.reverse();
        if (posts) {
          setPosts(posts);
        } else {
          setNoPostMessage("You have not posted anything...");
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("You have not posted anything yet...");
        setLoading(false);
      }
    };

    fetchPosts();
  });

  const adjustDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);

    const options = { month: "long", day: "numeric" };
    const formattedDate = dateTime.toLocaleDateString(undefined, options);

    const formattedTime = dateTime.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="main-content">
      {error ? (
        <div className="loader-container">{error}</div>
      ) : (
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              {noPostMessage === "" ? "" : noPostMessage}
              {posts.map((post, index) => (
                <div className={`post ${post.type}`} key={index}>
                  <div className="post-title">
                    <div>{post.title}</div>
                    {post.type}
                  </div>
                  <div className="post-date">
                    {adjustDateTime(post.datetime)}
                  </div>
                  <div style={{ padding: "5px 0" }} className="post-message">
                    {post.message}
                  </div>
                  <div className="reaction-signature">
                    <div style={{ fontFamily: "Playwrite CU" }}>
                      {post.username}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserPosts;

import React, { useLayoutEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import Emoji from "./Emoji";

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

  const handleEmote = (type) => {
    return <Emoji type={type} />;
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
              <h1 className="page-title">Posts by {username}</h1>
              <p className="page-subtitle">
                A glimpse into what they've been carrying.
              </p>
              {noPostMessage === "" ? "" : noPostMessage}
              {posts.map((post, index) => (
                <article
                  className={`post mood-${post.type}`}
                  key={post.postid || index}
                  style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                >
                  <div className="post-top">
                    <span className="mood-chip">
                      {handleEmote(post.type)}
                      {post.type}
                    </span>
                    <span className="post-date">
                      {adjustDateTime(post.datetime)}
                    </span>
                  </div>
                  <h2 className="post-title">{post.title}</h2>
                  <div className="post-message">{post.message}</div>
                  <div className="reaction-signature">
                    <span className="post-reaction" style={{ cursor: "default" }}>
                      <AiFillLike className="like-icon" /> {post.reaction}
                    </span>
                    <div className="post-signature">{post.username}</div>
                  </div>
                </article>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserPosts;

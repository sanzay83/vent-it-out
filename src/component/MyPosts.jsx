import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [noPostMessage, setNoPostMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteCheck, setDeleteCheck] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        if (token) {
          const username = localStorage.getItem("username");
          const response = await axios.post(
            `${API_URL}/vio/posts/userpost`,
            { username },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const posts = response.data.reverse();
          if (posts) {
            setPosts(posts);
          } else {
            setNoPostMessage("You have not posted anything...");
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [deleteCheck]);

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

  const handleDelete = async (postid) => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.delete(`${API_URL}/vio/posts/${postid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setDeleteCheck(!deleteCheck);
    } catch (err) {
      console.log(err);
    }
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
                <div className="post" key={index}>
                  <div className="post-title">{post.title}</div>
                  <div className="post-date">
                    {adjustDateTime(post.datetime)}
                  </div>
                  <div style={{ padding: "5px 0" }} className="post-message">
                    {post.message}
                  </div>
                  <div className="reaction-signature">
                    <div
                      className="post-reaction"
                      onClick={() => handleDelete(post.postid)}
                    >
                      Delete
                    </div>
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

export default MyPosts;

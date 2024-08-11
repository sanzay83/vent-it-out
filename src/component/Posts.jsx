import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/vio/posts`);
        const posts = response.data.reverse();
        setPosts(posts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    <div className="container posts">
      {error ? (
        <div className="loader-container">{error}</div>
      ) : (
        <>
          {" "}
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {posts.map((post, index) => (
                <div className="post" key={index}>
                  <div className="post-title">{post.title}</div>
                  <div className="post-date">
                    {adjustDateTime(post.datetime)}
                  </div>
                  <div className="post-message">{post.message}</div>
                  <div style={{ textAlign: "right" }} className="post-message">
                    <div style={{ fontFamily: "Playwrite CU" }}>
                      {post.username}
                    </div>
                  </div>
                  <div className="post-message">{post.reacts}</div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;

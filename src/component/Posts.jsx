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
        const response = await axios.get(`${API_URL}/posts/`);
        setPosts(response.data.reverse());
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container posts">
      {error ? (
        <div className="error-loader-container">{error}</div>
      ) : (
        <>
          {" "}
          {loading ? (
            <div className="error-loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {posts.map((post, index) => (
                <div className="post" key={index}>
                  <div className="post-title">{post.title}</div>
                  <div className="post-date">{post.datetime}</div>
                  <div className="post-message">{post.message}</div>
                  <div className="post-message">By: {post.username}</div>
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

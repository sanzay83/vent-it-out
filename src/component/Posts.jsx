import React, { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/vioposts/");
        setPosts(response.data);
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
                  <div className="post-message">{post.post_id}</div>
                  <div className="post-message">{post.user_id}</div>
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

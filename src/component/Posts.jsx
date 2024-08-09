import React, { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/vioposts/");
        setPosts(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    console.log(error);
  }
  return (
    <div className="container posts">
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
    </div>
  );
};

export default Posts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import { AiFillLike } from "react-icons/ai";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(0);

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
  }, [liked]);

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

  const handleReaction = async (postid, postuser, reaction) => {
    try {
      const user = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          `${API_URL}/vio/posts/reaction`,
          {
            postid,
            user,
            postuser,
            reaction,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLiked(response.data.message);
      } else {
        alert("Please login to like posts.");
      }
    } catch (err) {
      console.log(error);
    }
  };

  return (
    <div className="container posts">
      {error ? (
        <div className="loader-container">{error}</div>
      ) : (
        <>
          {" "}
          {loading ? (
            <Loader />
          ) : (
            <>
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
                      onClick={() =>
                        handleReaction(
                          post.postid,
                          post.username,
                          post.reaction
                        )
                      }
                    >
                      <AiFillLike size={"1.2em"} /> {post.reaction}
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

export default Posts;

import React, { useLayoutEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import Emoji from "./Emoji";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [noPostMessage, setNoPostMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteCheck, setDeleteCheck] = useState(false);

  useLayoutEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        if (token) {
          const username = localStorage.getItem("username");
          const response = await axios.post(`${API_URL}/vio/posts/userpost`, {
            username,
          });
          const posts = response.data.reverse();
          if (posts) {
            setPosts(posts);
          } else {
            setNoPostMessage("You have not posted anything...");
          }
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("You have not posted anything yet...");
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
        await axios.delete(`${API_URL}/vio/posts/${postid}`);
      }
      setDeleteCheck(!deleteCheck);
    } catch (err) {
      console.log(err);
    }
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
              <div style={{ fontSize: "30px" }}>{`Your Posts`}</div>
              {noPostMessage === "" ? "" : noPostMessage}
              {posts.map((post, index) => (
                <div className={`post`} key={index}>
                  <div className="post-title">
                    <div>{post.title}</div>
                    <div className="emoteContainer">
                      {handleEmote(post.type)}
                    </div>
                  </div>
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
              <div style={{ padding: "50px" }}></div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyPosts;

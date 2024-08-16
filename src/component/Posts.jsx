import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import { AiFillLike } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [liked, setLiked] = useState(0);
  const [page, setPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setMoreLoading(true);
        const response = await axios.get(
          `${API_URL}/vio/posts?page=${page}&limit=${"10"}`
        );
        const posts = response.data;
        setPosts((prev) => [...prev, ...posts]);
        if (posts.length < 10) {
          setNoMoreData(true);
        }
        setLoading(false);
        setMoreLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [liked, page]);

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
        const response = await axios.post(`${API_URL}/vio/posts/reaction`, {
          postid,
          user,
          postuser,
          reaction,
        });
        setLiked(response.data.message);
      } else {
        alert("Please login to like posts.");
      }
    } catch (err) {
      console.log(error);
    }
  };

  const handlePostSection = () => {
    if (localStorage.getItem("username")) {
      navigate("/postform");
    } else {
      navigate("/signin");
    }
  };

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="main-content">
      {error ? (
        <div className="loader-container">{error}</div>
      ) : (
        <>
          {" "}
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="post">
                <div className="whatsonyourmind" onClick={handlePostSection}>
                  {user
                    ? `What's on your mind, ${user}`
                    : "Please Sign In to Post."}
                </div>
              </div>
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
              {moreLoading ? (
                <Loader />
              ) : (
                <>
                  {" "}
                  {noMoreData ? (
                    <div className="post">
                      <div className="post-title">No more data to load</div>
                    </div>
                  ) : (
                    <div
                      className="post show-more"
                      onClick={() => handleShowMore()}
                    >
                      <div className="post-title">{"See More >"}</div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;

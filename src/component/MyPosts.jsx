import React, { useLayoutEffect, useState } from "react";
import { supabase, mapPost } from "../supabaseClient";
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
          const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("username", username)
            .order("created_at", { ascending: false });
          if (error) throw error;
          const posts = (data || []).map(mapPost);
          if (posts.length) {
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
        const { error } = await supabase.from("posts").delete().eq("id", postid);
        if (error) throw error;
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
              <h1 className="page-title">Your Posts</h1>
              <p className="page-subtitle">
                Everything you've let out into the world.
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
                    <button
                      className="post-reaction is-danger"
                      onClick={() => handleDelete(post.postid)}
                    >
                      Delete
                    </button>
                    <div className="post-signature">{post.username}</div>
                  </div>
                </article>
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

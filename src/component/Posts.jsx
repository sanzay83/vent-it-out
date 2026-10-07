import React, { useEffect, useLayoutEffect, useState } from "react";
import { supabase, mapPost } from "../supabaseClient";
import Loader from "./Loader";
import { AiFillLike } from "react-icons/ai";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Emoji from "./Emoji";

const PAGE_SIZE = 10;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [type, setType] = useState("All");
  const [liked, setLiked] = useState([0]);
  const [inputSearchPost, setInputSearchPost] = useState("");
  const [searchPost, setSearchPost] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const fetchPosts = async () => {
      if (!noMoreData) {
        try {
          setMoreLoading(true);
          let query = supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false })
            .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
          if (type !== "All") {
            query = query.eq("type", type);
          }
          const { data, error } = await query;
          if (error) throw error;

          const posts = (data || []).map(mapPost);

          if (posts.length < PAGE_SIZE) {
            setNoMoreData(true);
          } else {
            setNoMoreData(false);
          }

          if (type !== "All") {
            setPosts(posts);
          } else {
            setPosts((prev) => [...prev, ...posts]);
          }

          setLoading(false);
          setMoreLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    fetchPosts();
  }, [page, type, noMoreData]);

  useEffect(() => {
    const fetchSearchPosts = async () => {
      try {
        const q = `%${searchPost}%`;
        let query = supabase
          .from("posts")
          .select("*")
          .or(`title.ilike.${q},message.ilike.${q}`)
          .order("created_at", { ascending: false });
        if (type !== "All") {
          query = query.eq("type", type);
        }
        const { data, error } = await query;
        if (error) throw error;
        setPosts((data || []).map(mapPost));
      } catch (err) {
        console.log(err);
      }
    };
    if (searchPost) {
      fetchSearchPosts();
    }
  }, [liked, searchPost, type]);

  const handleSearch = () => {
    setSearchPost(inputSearchPost);
  };

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

  const handleReaction = async (postid, postuser, reaction, post) => {
    if (liked.includes(postid)) {
      alert("Post already liked!");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts.");
      return;
    }

    // Optimistic UI, then confirm with the server-side like_post() RPC
    // (one like per user — the database enforces it).
    const index = posts.indexOf(post);
    const updated = [...posts];
    updated[index] = { ...post, reaction: reaction + 1 };
    setPosts(updated);
    setLiked((prev) => [...prev, postid]);

    try {
      const { data: isNew, error } = await supabase.rpc("like_post", {
        p_post_id: postid,
      });
      if (error) throw error;
      if (!isNew) {
        // Already liked from another session — roll back the optimistic bump.
        const rolled = [...updated];
        rolled[index] = { ...post, reaction };
        setPosts(rolled);
        alert("Post already liked!");
      }
    } catch (err) {
      console.log(err);
      const rolled = [...posts];
      rolled[index] = { ...post, reaction };
      setPosts(rolled);
      setLiked((prev) => prev.filter((id) => id !== postid));
    }
  };

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setTimeout(() => {
        setPage((prev) => prev + 1);
      }, 3000);
    }
  });

  const handleType = (itemType) => {
    setNoMoreData(false);
    setType(itemType);
    setPage(0);
  };

  const handleLink = (username) => {
    navigate("/userposts", { state: { username: username } });
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
          {" "}
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="feed-hero">
                <h1>
                  Let it out. <span className="gradient-word">No judgment.</span>
                </h1>
                <p>
                  A safe, anonymous space to share what's on your mind — the
                  good, the heavy, and everything in between.
                </p>
              </div>
              <div>
                <div className="search-sort-container">
                  <div className="search-side">
                    <input
                      type="text"
                      value={inputSearchPost}
                      onChange={(e) => setInputSearchPost(e.target.value)}
                      placeholder="Search vents..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />

                    <IoMdSearch
                      className="search-icon"
                      onClick={handleSearch}
                    />
                  </div>
                  <div className="sort-side" tabIndex={0}>
                    <span className="sort-label">{type}</span>{" "}
                    <IoMdArrowDropdown />
                    <div className="dropdown-item">
                      <div onClick={() => handleType("All")}>All moods</div>
                      <div onClick={() => handleType("Happy")}>
                        <Emoji type="Happy" /> Happy
                      </div>
                      <div onClick={() => handleType("Sad")}>
                        <Emoji type="Sad" /> Sad
                      </div>
                      <div onClick={() => handleType("Angry")}>
                        <Emoji type="Angry" /> Angry
                      </div>
                      <div onClick={() => handleType("Love")}>
                        <Emoji type="Love" /> Love
                      </div>
                      <div onClick={() => handleType("Surprise")}>
                        <Emoji type="Surprise" /> Surprise
                      </div>
                      <div onClick={() => handleType("Relaxed")}>
                        <Emoji type="Relaxed" /> Relaxed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      className={`post-reaction ${
                        liked.includes(post.postid) ? "is-liked" : ""
                      }`}
                      onClick={() =>
                        handleReaction(
                          post.postid,
                          post.username,
                          post.reaction,
                          post
                        )
                      }
                    >
                      <AiFillLike className="like-icon" /> {post.reaction}
                    </button>
                    <div
                      className="post-signature"
                      onClick={() => handleLink(post.username)}
                    >
                      {post.username}
                    </div>
                  </div>
                </article>
              ))}
              {moreLoading ? (
                <Loader />
              ) : (
                <>
                  {searchPost ? (
                    ""
                  ) : (
                    <>
                      {noMoreData ? (
                        <div className="show-more">
                          You've reached the end — breathe easy.
                        </div>
                      ) : (
                        ""
                      )}
                    </>
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

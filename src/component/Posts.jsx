import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import { AiFillLike } from "react-icons/ai";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Emoji from "./Emoji";

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
          const response = await axios.get(
            `${API_URL}/vio/posts?page=${page}&limit=${"10"}&postType=${type}`,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          const posts = response.data;

          if (posts.length < 10) {
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
        const response = await axios.get(
          `https://vio.aapugu.com/vio/posts/search?search=${searchPost}&postType=${type}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        const posts = response.data;
        setPosts(posts);
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
    if (!liked.includes(postid)) {
      let index = posts.indexOf(post);
      posts[index]["reaction"] = reaction + 1;
      setPosts(posts);
      setLiked((prev) => [...prev, postid]);

      try {
        const user = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        if (token) {
          await axios.post(`${API_URL}/vio/posts/reaction`, {
            postid,
            user,
            postuser,
            reaction,
          });
        } else {
          alert("Please login to like posts.");
        }
      } catch (err) {
        console.log(error);
      }
    } else {
      alert("Post already liked!");
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
              <div style={{ paddingTop: "20px" }}>
                <div className="search-sort-container">
                  <div className="search-side">
                    <input
                      type="text"
                      value={inputSearchPost}
                      onChange={(e) => setInputSearchPost(e.target.value)}
                      placeholder="Search"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />

                    <IoMdSearch
                      className="search-icon"
                      onClick={handleSearch}
                    />
                  </div>
                  <div className="sort-side">
                    {" "}
                    {type} <IoMdArrowDropdown />
                    <div className="dropdown-item">
                      <div onClick={() => handleType("All")}>All</div>
                      <div onClick={() => handleType("Happy")}>Happy</div>
                      <div onClick={() => handleType("Sad")}>Sad</div>
                      <div onClick={() => handleType("Angry")}>Angry</div>
                      <div onClick={() => handleType("Love")}>Love</div>
                      <div onClick={() => handleType("Surprise")}>Surprise</div>
                      <div onClick={() => handleType("Relaxed")}>Relaxed</div>
                    </div>
                  </div>
                </div>
              </div>
              {posts.map((post, index) => (
                <div className={`post`} key={index}>
                  <div className="post-title">
                    <div>{post.title}</div>{" "}
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
                    </div>
                    <div
                      style={{ fontFamily: "Playwrite CU", cursor: "pointer" }}
                      onClick={() => handleLink(post.username)}
                    >
                      {post.username}
                    </div>
                  </div>
                </div>
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
                          <div className="post-title">No more data to load</div>
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

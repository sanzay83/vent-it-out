import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Loader from "./Loader";
import { AiFillLike } from "react-icons/ai";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { ImHappy2, ImSad2, ImAngry2 } from "react-icons/im";
import { FaSurprise } from "react-icons/fa";
import { BsEmojiSunglassesFill, BsEmojiHeartEyesFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

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

        if (type !== "All") {
          setPosts(posts);
        } else {
          setPosts((prev) => [...prev, ...posts]);
        }

        if (posts.length < 10) {
          setNoMoreData(true);
        } else {
          setNoMoreData(false);
        }

        setLoading(false);
        setMoreLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, type]);

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

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleType = (itemType) => {
    setType(itemType);
    setPage(0);
  };

  const handleLink = (username) => {
    navigate("/userposts", { state: { username: username } });
  };

  const handleEmote = (type) => {
    if (type === "Happy") {
      return (
        <ImHappy2
          style={{ backgroundColor: "black", borderRadius: "50%" }}
          color="#ffd60a"
        />
      );
    } else if (type === "Sad") {
      return (
        <ImSad2
          style={{ backgroundColor: "black", borderRadius: "50%" }}
          color="#4cc9f0"
        />
      );
    } else if (type === "Angry") {
      return (
        <ImAngry2
          style={{ backgroundColor: "black", borderRadius: "50%" }}
          color="red"
        />
      );
    } else if (type === "Love") {
      return (
        <BsEmojiHeartEyesFill
          style={{ backgroundColor: "black", borderRadius: "50%" }}
          color="rgb(255, 152, 170)"
        />
      );
    } else if (type === "Surprised") {
      return (
        <FaSurprise
          style={{ backgroundColor: "black", borderRadius: "50%" }}
          color="#5fcf8e"
        />
      );
    } else if (type === "Relaxed") {
      return (
        <BsEmojiSunglassesFill
          style={{ backgroundColor: "black", borderRadius: "50%" }}
          color="#ffd60a"
        />
      );
    }
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
              <div style={{ paddingTop: "10px" }}>
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
                        <div className="post">
                          <div className="post-title">No more data to load</div>
                        </div>
                      ) : (
                        <div
                          className="show-more"
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
        </>
      )}
    </div>
  );
};

export default Posts;

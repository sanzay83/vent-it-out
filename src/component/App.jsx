import Header from "./Header";
import "../styles/App.scss";
import Posts from "./Posts";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import SignIn from "./SignIn";
import About from "./About";
import PostForm from "./PostForm";
import Register from "./Register";
import { useEffect, useState } from "react";
import MyPosts from "./MyPosts";
import Chat from "./Chat";
import SplashScreen from "./SplashScreen";
import UserPosts from "./UserPosts";
import Footer from "./Footer";

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSplash, setIsSplash] = useState(localStorage.getItem("flash"));

  useEffect(() => {
    if (!localStorage.getItem("flash")) {
      setIsSplash(false);
    } else {
      setIsSplash(true);
    }
  }, [isSplash]);

  return (
    <Router>
      {!isSplash ? (
        <SplashScreen setIsSplash={setIsSplash} />
      ) : (
        <div className={`App ${localStorage.getItem("theme") || "dark"}`}>
          <Header isDark={isDark} setIsDark={setIsDark} />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Posts />
                </>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/postform" element={<PostForm />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/userposts" element={<UserPosts />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          <Footer isDark={isDark} setIsDark={setIsDark} />
        </div>
      )}
    </Router>
  );
};

export default App;

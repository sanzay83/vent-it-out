import Header from "./Header";
import "./App.scss";
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
        <div className={`App ${localStorage.getItem("theme") || "light"}`}>
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
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      )}
    </Router>
  );
};

export default App;

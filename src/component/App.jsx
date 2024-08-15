import Header from "./Header";
import "./App.scss";
import Posts from "./Posts";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import SignIn from "./SignIn";
import About from "./About";
import PostForm from "./PostForm";
import Register from "./Register";
import { useState } from "react";
import MyPosts from "./MyPosts";

const App = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <Router>
      <div className={`App ${localStorage.getItem("theme")}`}>
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;

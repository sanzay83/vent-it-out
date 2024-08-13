import Header from "./Header";
import "./App.scss";
import PostSection from "./PostSection";
import Posts from "./Posts";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import SignIn from "./SignIn";
import About from "./About";
import PostForm from "./PostForm";
import Register from "./Register";
import { useState } from "react";

const App = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <Router>
      <div className={`App ${localStorage.getItem("theme")}`}>
        <Header setIsDark={setIsDark} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PostSection />
                <Posts />
              </>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/postform" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

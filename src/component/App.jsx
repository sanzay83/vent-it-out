import Header from "./Header";
import "./App.scss";
import PostSection from "./PostSection";
import Posts from "./Posts";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import SignIn from "./SignIn";
import About from "./About";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
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
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

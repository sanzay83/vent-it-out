import Header from "./Header";
import "./App.scss";
import PostSection from "./PostSection";
import Posts from "./Posts";

const App = () => {
  return (
    <div className="App">
      <Header />
      <PostSection />
      <Posts />
    </div>
  );
};

export default App;

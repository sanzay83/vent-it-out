import React from "react";

const Posts = () => {
  const items = [
    { id: "", message: "It was so boring day." },
    { id: "", message: "It was so boring day." },
    { id: "", message: "It was so boring day." },
    { id: "", message: "It was so boring day." },
    { id: "", message: "It was so boring day." },
  ];
  return (
    <div className="container posts">
      {items.map((item, index) => (
        <div className="post" key={index}>
          {item.message}
        </div>
      ))}
    </div>
  );
};

export default Posts;

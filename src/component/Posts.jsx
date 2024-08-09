import React from "react";

const Posts = () => {
  const items = [
    {
      id: "",
      title: "Today activity",
      message: "It was so boring day.",
      date: "August 08 at 08:08pm",
    },
    {
      id: "",
      title: "Today activity",
      message: "It was so boring day.",
      date: "August 08 at 08:08pm",
    },
    {
      id: "",
      title: "Today activity",
      message: "It was so boring day.",
      date: "August 08 at 08:08pm",
    },
    {
      id: "",
      title: "Today activity",
      message: "It was so boring day.",
      date: "August 08 at 08:08pm",
    },
    {
      id: "",
      title: "Today activity",
      message: "It was so boring day.",
      date: "August 08 at 08:08pm",
    },
    {
      id: "",
      title: "Today activity",
      message: "It was so boring day.",
      date: "August 08 at 08:08pm",
    },
  ];
  return (
    <div className="container posts">
      {items.map((item, index) => (
        <div className="post" key={index}>
          {item.title}
          {item.message}
        </div>
      ))}
    </div>
  );
};

export default Posts;

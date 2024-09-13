import React from "react";
import { ImHappy2, ImSad2, ImAngry2 } from "react-icons/im";
import { FaSurprise } from "react-icons/fa";
import { BsEmojiSunglassesFill, BsEmojiHeartEyesFill } from "react-icons/bs";

function Emoji({ type }) {
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
  } else if (type === "Surprise") {
    return (
      <FaSurprise
        style={{ backgroundColor: "black", borderRadius: "50%" }}
        color="#ffd60a"
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
}

export default Emoji;

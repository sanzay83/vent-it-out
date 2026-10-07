import React from "react";
import { ImHappy2, ImSad2, ImAngry2 } from "react-icons/im";
import { FaSurprise } from "react-icons/fa";
import { BsEmojiSunglassesFill, BsEmojiHeartEyesFill } from "react-icons/bs";

const moodColor = {
  Happy: "#fbbf24",
  Sad: "#60a5fa",
  Angry: "#f87171",
  Love: "#f472b6",
  Surprise: "#c084fc",
  Relaxed: "#34d399",
};

const moodIcon = {
  Happy: ImHappy2,
  Sad: ImSad2,
  Angry: ImAngry2,
  Love: BsEmojiHeartEyesFill,
  Surprise: FaSurprise,
  Relaxed: BsEmojiSunglassesFill,
};

function Emoji({ type }) {
  const Icon = moodIcon[type];
  if (!Icon) return null;
  return (
    <span
      className="mood-emoji"
      style={{ display: "inline-flex", color: moodColor[type] }}
    >
      <Icon />
    </span>
  );
}

export default Emoji;

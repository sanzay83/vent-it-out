import React from "react";

function SplashScreen({ setIsSplash }) {
  const varr = [
    [
      "Are you frustrated?",
      "Lets takeout your frustration and forget about it.",
    ],
    ["Are you happy?", " Lets share your happiness to world."],
    ["Are you sad?", " Let other know."],
    [
      "Feeling down?",
      " Don’t keep it to yourself share the vibe and let others in on your feelings!",
    ],
    [
      "Got the blues?",
      " It’s time to spill the beans and let the world know how you’re really doing!",
    ],
    [
      "Are you feeling a bit low?",
      " Open up and let others know sometimes sharing is the best way to lighten the load!",
    ],
    [
      "Feeling frustrated?",
      " Let’s shake it off and dive into some fun instead!",
    ],
    [
      "Tired of that frustration weighing you down?",
      " Let’s kick it to the curb and have a blast!",
    ],
    [
      "Frustration got you down? ",
      "Time to release it and embrace some good vibes!",
    ],
    [
      "Feeling happy? ",
      "Let’s spread that joy and light up the world together!",
    ],
    [" Got happiness? ", "Let’s turn that smile into a global celebration!"],
    [
      "Are you buzzing with happiness? ",
      "Let’s share that vibe and make the world a brighter place!",
    ],
    [
      " Ever wanted to spill your secrets without anyone knowing? ",
      "Dive into the world of anonymous sharing!",
    ],
    [
      "What if you could share your thoughts without a trace? ",
      "Welcome to the realm of anonymous expression!",
    ],
    [
      "Imagine a place where your voice is heard,",
      " but your identity stays hidden. Let's explore the magic of anonymity!",
    ],
  ];

  const randomNumber = Math.floor(Math.random() * varr.length);

  const handleButton = () => {
    setIsSplash(false);
  };
  return (
    <>
      <div className="splash-screen">
        <div className="qtext">{varr[randomNumber][0]}</div>
        <br />
        <div className="text">{varr[randomNumber][1]}</div>
        <br />

        <button className="splash-button" onClick={handleButton}>
          Lets do it
        </button>
      </div>
    </>
  );
}

export default SplashScreen;

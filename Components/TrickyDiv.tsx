"use client";

import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const TrickyDiv = () => {
  const [position, setPosition] = useState({ x: 200, y: 200 });

  // Generate a new random position when hovered
  const moveDiv = () => {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 100)); // Width boundary
    const randomY = Math.floor(Math.random() * (window.innerHeight - 100)); // Height boundary
    setPosition({ x: randomX, y: randomY });
  };

  // Spring animation for smooth movement
  const styles = useSpring({
    to: { transform: `translate(${position.x}px, ${position.y}px)` },
    config: { tension: 200, friction: 15 },
  });

  return (
    <animated.div
      onMouseEnter={moveDiv} // Trigger move when hovered
      style={{
        ...styles,
        width: "100px",
        height: "100px",
        backgroundColor: "tomato",
        borderRadius: "8px",
        position: "absolute",
        cursor: "pointer",
      }}
    />
  );
};

export default TrickyDiv;

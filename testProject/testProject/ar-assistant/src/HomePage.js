import React, { useState, useEffect } from 'react';
import './HomePage.css';

import image1 from './images/image1.jpg';



const images = [image1];

const textColors = [
  '#FFFFFF', // White
  '#FFCC00', // Yellow
  '#00FFCC', // Cyan
  '#FF33CC', // Magenta
  '#00FF99', // Light Green
  '#FF6633', // Orange
  '#33FFCC', // Light Blue
  '#FF9966', // Peach
  '#99FF33', // Lime Green
  '#3399FF', // Blue
];

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [textColor, setTextColor] = useState(textColors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextImage = (currentImage + 1) % images.length;
      setCurrentImage(nextImage);
      setBackgroundImage(images[nextImage]);
      setTextColor(textColors[nextImage % textColors.length]);
    }, 5000); // Change image every 50 seconds

    return () => clearInterval(interval);
  }, [currentImage]);

  const navigateToNextPage = () => {
    window.location.href = '/resume'; 
  };

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="content-box" style={{ color: textColor }}>
        <h1 className="animated-title">AR Mock Interview Assistant</h1>
        <p className="animated-text">Your AR Assistant is a few steps away!!! Explore more!</p>
        <button className="explore-button" onClick={navigateToNextPage}>
          <span className="arrow-icon">➔</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;

// About.js
import React from "react";
import "./css/About.css"; // Import associated CSS for styling

/**
 * About Component
 *
 * This page provides a brief explanation about the statue collection
 * and the background of the creator. It uses basic textual content
 * styled with About.css.
 */
function About() {
  // Renders a container with a title and descriptive paragraphs
  return (
    <div className="container">
      <h1 className="about-title">About</h1>
      <p className="about-text">This page is all about my mom’s statues.</p>
      <p className="about-text">
        Created by <strong>Benyamin Geerts</strong>. The statues featured here
        are handcrafted from fabric materials, reflecting years of passion and
        dedication.
      </p>
    </div>
  );
}

export default About;

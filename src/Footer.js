// Footer.js
import React from "react";

/**
 * Footer:
 * A simple footer component that appears at the bottom of the page.
 * Includes styling for a centered layout and a background color.
 */
function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <p>Created by Benyamin Geerts</p>
    </footer>
  );
}

export default Footer;

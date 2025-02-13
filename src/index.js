import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * index.js:
 * The main entry point for your React application.
 *  1) Imports core dependencies (React, ReactDOM).
 *  2) Imports global CSS (index.css).
 *  3) Renders the <App /> component into the #root element in the DOM,
 *     wrapped in <React.StrictMode> to highlight potential problems.
 */

const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the main <App /> component within the "root" DOM node
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

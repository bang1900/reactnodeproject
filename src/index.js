/**
 * index.js:
 * Main entry point for React. Renders <App /> into #root.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global styles or resets
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

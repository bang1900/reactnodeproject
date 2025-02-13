/**
 * App.js
 *
 * Main React entry for routing and navigation.
 * - Calls /auth-status on load to check if the user is logged in.
 * - Tracks the logged-in user's state in `user`.
 * - Dynamically renders navigation links based on `user` (and role).
 * - Includes routes for registering, logging in, viewing/editing/adding statues, etc.
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import ElementDetail from "./ElementDetail";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register"; // Page for user registration
import AddStatue from "./AddStatue";
import EditStatue from "./EditStatue";
import Favorites from "./Favorites";

function App() {
  // Holds the current logged-in user object, or null if not logged in
  const [user, setUser] = useState(null);

  /**
   * useEffect:
   *  - On initial load, check the server for auth status
   *  - If authenticated, set the `user` state with the returned user object
   */
  useEffect(() => {
    axios
      .get("http://localhost:8081/auth-status", { withCredentials: true })
      .then((response) => {
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      })
      .catch((error) => {
        console.error("Error checking auth status:", error);
      });
  }, []);

  /**
   * handleLogout:
   *  - Makes a POST request to the server's /logout endpoint
   *  - Clears the `user` state on success (i.e. user is no longer logged in)
   */
  const handleLogout = () => {
    axios
      .post("http://localhost:8081/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    // BrowserRouter: Wraps our app in router context, enabling routes & links
    <Router>
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          {/* Basic links, visible to all users (logged-in or not) */}
          <Link to="/" style={{ textDecoration: "none", color: "#333" }}>
            Home
          </Link>
          <Link to="/about" style={{ textDecoration: "none", color: "#333" }}>
            About
          </Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "#333" }}>
            Contact
          </Link>

          {/* Conditional links: Only show if user is logged in */}
          {user && (
            <>
              {/* Admin-only link to Add a Statue */}
              {user.role === "admin" && (
                <Link
                  to="/add"
                  style={{ textDecoration: "none", color: "#333" }}
                >
                  Add Statue
                </Link>
              )}

              {/* Favorites link for any logged-in user */}
              <Link
                to="/favorites"
                style={{ textDecoration: "none", color: "#333" }}
              >
                Favorites
              </Link>
            </>
          )}

          {/* Authentication Info: 
              If user is logged in, show logout & greeting;
              otherwise, show links to login and register. */}
          {user ? (
            <>
              <span style={{ marginLeft: "15px" }}>
                Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "15px",
                  background: "none",
                  border: "none",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#333" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  marginLeft: "15px",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Application Routes */}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Statue routes */}
        <Route path="/statue/:id" element={<ElementDetail user={user} />} />
        <Route path="/edit/:id" element={<EditStatue user={user} />} />
        <Route path="/add" element={<AddStatue user={user} />} />

        {/* Favorites page (requires logged-in user) */}
        <Route path="/favorites" element={<Favorites />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Footer is rendered at the bottom of every page */}
      <Footer />
    </Router>
  );
}

export default App;

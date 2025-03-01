/**
 * App.js
 * Main Router + Navigation
 *
 * This file manages:
 *  - The global user state (tracking logged-in user)
 *  - Navigation bar (conditionally showing links based on user/role)
 *  - React Router's route definitions for pages like Home, About, etc.
 */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

// Import page components
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import ElementDetail from "./ElementDetail";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import AddStatue from "./AddStatue";
import EditStatue from "./EditStatue";
import Favorites from "./Favorites";

// Import global or shared CSS
import "./css/App.css";

function App() {
  // user: stores the logged-in user object or null if not logged in
  const [user, setUser] = useState(null);

  /**
   * useEffect:
   *   On component mount, check the server for 'auth-status'
   *   If authenticated, set the 'user' state to the returned user object
   *   If not, user remains null
   */
  useEffect(() => {
    axios
      .get("http://localhost:8081/auth-status", { withCredentials: true })
      .then((res) => {
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        }
      })
      .catch((err) => console.error("Error checking auth:", err));
  }, []);

  /**
   * handleLogout:
   *   Calls the server's /logout endpoint
   *   On success, clears the user state
   */
  const handleLogout = () => {
    axios
      .post("http://localhost:8081/logout", {}, { withCredentials: true })
      .then(() => setUser(null))
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <div className="page-container">
      <Router>
        {/* 
          content-wrap takes up the "flex: 1" space.
          The Footer is placed below, so it stays at the bottom for short pages.
        */}
        <div className="content-wrap">
          {/* Navigation Bar */}
          <nav className="app-nav">
            <div className="app-nav-links">
              {/* Basic links always visible */}
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>

              {/* Links visible only if user is logged in */}
              {user && (
                <>
                  {/* Admin-only link to Add Statue */}
                  {user.role === "admin" && <Link to="/add">Add Statue</Link>}
                  {/* Favorites link for any logged-in user */}
                  <Link to="/favorites">Favorites</Link>
                </>
              )}

              {/* If user is logged in, show logout & greeting; otherwise show login/register */}
              {user ? (
                <>
                  <span className="app-nav-user">Welcome, {user.username}</span>
                  <button className="app-nav-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </nav>

          {/* Main Routes definition using React Router v6 */}
          <Routes>
            {/* Home route, pass 'user' as prop so Home can use it if needed */}
            <Route path="/" element={<Home user={user} />} />

            {/* Public pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Statue detail & editing pages */}
            <Route path="/statue/:id" element={<ElementDetail user={user} />} />
            <Route path="/edit/:id" element={<EditStatue user={user} />} />

            {/* Admin-only add new statue page */}
            <Route path="/add" element={<AddStatue user={user} />} />

            {/* Favorites page (requires user) */}
            <Route path="/favorites" element={<Favorites />} />

            {/* Auth pages */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        {/* Footer is displayed on every page, pinned at bottom on short pages */}
        <Footer />
      </Router>
    </div>
  );
}

export default App;

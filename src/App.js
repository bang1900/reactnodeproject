import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import ElementDetail from "./ElementDetail";
import Footer from "./Footer";
import Login from "./Login";
import AddStatue from "./AddStatue";

function App() {
  const [user, setUser] = useState(null);

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
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "center", // Center the navbar
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#333" }}>
            Home
          </Link>
          <Link to="/about" style={{ textDecoration: "none", color: "#333" }}>
            About
          </Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "#333" }}>
            Contact
          </Link>
          {user && (
            <Link to="/add" style={{ textDecoration: "none", color: "#333" }}>
              Add Statue
            </Link>
          )}
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
            <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/element/:id" element={<ElementDetail />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/add" element={<AddStatue />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

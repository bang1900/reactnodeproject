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
import EditStatue from "./EditStatue";

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
      <nav style={{ display: "flex", justifyContent: "center", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {user && <Link to="/add">Add Statue</Link>}
          {user ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/statue/:id" element={<ElementDetail user={user} />} />
        <Route path="/edit/:id" element={<EditStatue user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

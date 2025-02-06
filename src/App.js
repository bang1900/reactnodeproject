import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import ElementDetail from "./ElementDetail";
import Footer from "./Footer";
import axios from "axios"; // ✅ Import axios

function App() {
  const [statues, setStatues] = useState([]);

  // Fetch statues from backend
  useEffect(() => {
    axios
      .get("http://localhost:8081/statues")
      .then((response) => setStatues(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router>
      <nav
        style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          textAlign: "center",
        }}
      >
        <span
          style={{ fontWeight: "bold", fontSize: "18px", marginRight: "15px" }}
        >
          My Mom's Statues
        </span>
        <Link
          to="/"
          style={{ margin: "0 15px", textDecoration: "none", color: "#333" }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{ margin: "0 15px", textDecoration: "none", color: "#333" }}
        >
          About
        </Link>
        <Link
          to="/contact"
          style={{ margin: "0 15px", textDecoration: "none", color: "#333" }}
        >
          Contact
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home statues={statues} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* ✅ Pass statues via URL param instead of props */}
        <Route
          path="/element/:id"
          element={<ElementDetail statues={statues} />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

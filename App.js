// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import ElementDetail from "./ElementDetail";
import About from "./About"; // <-- import About
import Footer from "./Footer";

function App() {
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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> {/* <-- new route */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/element/:id" element={<ElementDetail />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

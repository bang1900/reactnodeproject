// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import ElementDetail from "./ElementDetail";
import Footer from "./Footer";
// Import the default statues array from data.js
import { statues as defaultStatues } from "./data";
// NEW: Import our AddStatue page
import AddStatue from "./AddStatue";

function App() {
  // Store statues in state so multiple pages can share the same data
  const [statues, setStatues] = useState(defaultStatues);

  return (
    <Router>
      {/* A simple navigation bar */}
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
        {/* NEW: Link to Add Statue page */}
        <Link
          to="/add"
          style={{ margin: "0 15px", textDecoration: "none", color: "#333" }}
        >
          Add Statue
        </Link>
      </nav>

      {/* Define all your routes */}
      <Routes>
        {/* Home (just pass down statues as a prop) */}
        <Route path="/" element={<Home statues={statues} />} />

        {/* Other pages remain the same */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Detail page: pass statues so it can find the correct one */}
        <Route
          path="/element/:id"
          element={<ElementDetail statues={statues} />}
        />

        {/* NEW: Route for adding a statue. Pass both statues + setStatues */}
        <Route
          path="/add"
          element={<AddStatue statues={statues} setStatues={setStatues} />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

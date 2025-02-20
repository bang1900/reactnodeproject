// Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/Home.css";

/**
 * Home:
 * Fetches a list of statues from the server and displays
 * them in a grid. Clicking a statue navigates to its detail page.
 */
function Home({ user }) {
  const [statues, setStatues] = useState([]);
  const [error, setError] = useState(null);

  // Fetch statue data on mount
  useEffect(() => {
    axios
      .get("http://localhost:8081/statues")
      .then((response) => setStatues(response.data))
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error fetching statues. Please try again later.");
      });
  }, []);

  if (error) {
    return <p className="home-error">{error}</p>;
  }

  return (
    <div className="container">
      <h1 className="home-title">Welcome to My Mom's Statue Gallery</h1>
      <p className="home-subtitle">
        Click on any statue below to learn more about it!
      </p>

      <div className="home-grid">
        {statues.map((statue) => (
          <Link
            key={statue.id}
            to={`/statue/${statue.id}`}
            className="home-statue-link"
          >
            <img
              src={statue.image}
              alt={statue.name}
              onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
              className="home-statue-image"
            />
            <p className="home-statue-name">{statue.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

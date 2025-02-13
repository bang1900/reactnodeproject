// Favorites.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/**
 * Favorites:
 * Fetches and displays all statues that the currently logged-in user
 * has marked as favorites. Uses a grid layout to show statue images
 * and names, linking to each statue's detail page.
 */
function Favorites() {
  // Local state to store the list of favorite statues
  const [favorites, setFavorites] = useState([]);

  /**
   * useEffect:
   *  - On component mount, send a GET request to /favorites
   *  - This route requires the user to be logged in (session-based)
   *  - On success, store the list of favorites in state.
   */
  useEffect(() => {
    axios
      .get("http://localhost:8081/favorites", { withCredentials: true })
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>My Favorite Statues</h1>
      {/* If no favorites, show a simple message; otherwise render a grid of statues */}
      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>No favorites yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            padding: "20px",
          }}
        >
          {favorites.map((statue) => (
            <Link
              key={statue.id}
              to={`/statue/${statue.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={statue.image}
                alt={statue.name}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <p>
                <strong>{statue.name}</strong>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

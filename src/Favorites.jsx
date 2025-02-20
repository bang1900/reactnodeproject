// Favorites.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/Favorites.css";

/**
 * Favorites:
 * Displays all statues the user has added to their favorites.
 * If none, shows a message.
 */
function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Fetch the user's favorites upon mount
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
    <div className="container">
      <h1 className="favorites-title">My Favorite Statues</h1>

      {favorites.length === 0 ? (
        // Show message if no favorites
        <p className="favorites-empty">No favorites yet.</p>
      ) : (
        // Show grid of favorites
        <div className="favorites-grid">
          {favorites.map((statue) => (
            <Link
              key={statue.id}
              to={`/statue/${statue.id}`}
              className="favorites-link"
            >
              <img
                src={statue.image}
                alt={statue.name}
                className="favorites-image"
              />
              <p className="favorites-name">{statue.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

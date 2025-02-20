// ElementDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ElementDetail.css";

/**
 * ElementDetail:
 * Displays details for a single statue (fetched by ID).
 * If admin, shows Edit/Delete buttons.
 * If logged in, shows Favorite toggle.
 */
function ElementDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [statue, setStatue] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch statue data and favorites (if user is logged in)
  useEffect(() => {
    // 1) GET statue by ID
    axios
      .get(`http://localhost:8081/statues/${id}`)
      .then((res) => setStatue(res.data))
      .catch(() => setError("Error fetching statue details"));

    // 2) If user is logged in, check if statue is in favorites
    if (user) {
      axios
        .get("http://localhost:8081/favorites", { withCredentials: true })
        .then((res) => {
          const favArr = res.data;
          const favStatus = favArr.some((item) => item.id === parseInt(id, 10));
          setIsFavorite(favStatus);
        })
        .catch(() => console.error("Error checking favorites"));
    }
  }, [id, user]);

  /**
   * handleFavoriteToggle:
   *   Adds or removes the statue from the user's favorites
   *   if user is logged in.
   */
  const handleFavoriteToggle = () => {
    if (!user) {
      alert("Please log in to save favorites.");
      return;
    }

    if (isFavorite) {
      // Remove from favorites
      axios
        .delete(`http://localhost:8081/favorites/${id}`, {
          withCredentials: true,
        })
        .then(() => setIsFavorite(false))
        .catch(() => alert("Failed to remove from favorites."));
    } else {
      // Add to favorites
      axios
        .post(
          "http://localhost:8081/favorites",
          { statue_id: id },
          { withCredentials: true }
        )
        .then(() => setIsFavorite(true))
        .catch(() => alert("Failed to add to favorites."));
    }
  };

  /**
   * handleDelete:
   *   Deletes statue from DB if user is admin.
   *   Then redirects to Home.
   */
  const handleDelete = () => {
    if (!user || user.role !== "admin") {
      alert("Unauthorized. Only admins can delete a statue.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this statue?")) {
      axios
        .delete(`http://localhost:8081/statues/${id}`, {
          withCredentials: true,
        })
        .then(() => {
          alert("Statue deleted successfully!");
          navigate("/");
        })
        .catch(() => alert("Failed to delete statue. Please try again."));
    }
  };

  if (error) {
    return <p className="detail-error">{error}</p>;
  }
  if (!statue) {
    return <p className="detail-loading">Loading statue details...</p>;
  }

  return (
    <div className="container">
      <h1 className="detail-title">{statue.name}</h1>
      <img src={statue.image} alt={statue.name} className="detail-image" />
      <p className="detail-description">{statue.description}</p>

      {/* Admin Options */}
      {user && user.role === "admin" && (
        <div className="detail-admin-buttons">
          <button
            className="detail-edit-btn"
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit Statue
          </button>
          <button className="detail-delete-btn" onClick={handleDelete}>
            Delete Statue
          </button>
        </div>
      )}

      {/* Favorite Toggle (if user is logged in) */}
      {user && (
        <button
          className={`detail-fav-btn ${isFavorite ? "detail-fav-remove" : ""}`}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"}
        </button>
      )}
    </div>
  );
}

export default ElementDetail;

// ElementDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ElementDetail
 *
 * Displays the details of a single statue (fetched by ID),
 * provides options for editing or deleting it if the user
 * is an admin, and allows the user to add/remove it
 * from their favorites if logged in.
 */
function ElementDetail({ user }) {
  // Retrieve the `id` parameter from the URL
  const { id } = useParams();

  // Hook for programmatic navigation (e.g., after delete)
  const navigate = useNavigate();

  // Local state to store the current statue object
  const [statue, setStatue] = useState(null);

  // Local state to store any error message
  const [error, setError] = useState(null);

  // Tracks whether this statue is in the user's favorites
  const [isFavorite, setIsFavorite] = useState(false);

  // ----------------------------
  // useEffect: Fetch statue data
  // & check if it's a favorite
  // ----------------------------
  useEffect(() => {
    // 1) Fetch single statue by ID
    axios
      .get(`http://localhost:8081/statues/${id}`)
      .then((response) => setStatue(response.data))
      .catch(() => setError("Error fetching statue details"));

    // 2) If user is logged in, fetch favorites to see if this statue is favorited
    if (user) {
      axios
        .get("http://localhost:8081/favorites", { withCredentials: true })
        .then((response) => {
          const favoritesArr = response.data;
          // Check if the current statue's id is in the user's favorites
          setIsFavorite(
            favoritesArr.some((fav) => fav.id === parseInt(id, 10))
          );
        })
        .catch(() => console.error("Error checking favorites"));
    }
    // Dependencies: re-run when `id` or `user` changes
  }, [id, user]);

  /**
   * handleFavoriteToggle:
   * - If user isn't logged in, prompt them to log in.
   * - If statue is currently a favorite, remove it.
   * - Otherwise, add it to favorites.
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
        .catch(() => alert("Failed to remove from favorites"));
    } else {
      // Add to favorites
      axios
        .post(
          "http://localhost:8081/favorites",
          { statue_id: id },
          { withCredentials: true }
        )
        .then(() => setIsFavorite(true))
        .catch(() => alert("Failed to add to favorites"));
    }
  };

  /**
   * handleDelete:
   * - Ensures user is admin.
   * - Asks for confirmation.
   * - Deletes statue from DB, then redirects home on success.
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
          navigate("/"); // redirect back to Home (or wherever you prefer)
        })
        .catch((err) => {
          console.error("Error deleting statue:", err);
          alert("Failed to delete statue. Please try again.");
        });
    }
  };

  // If there's an error, display it in red
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // If statue isn't loaded yet, show a loading indicator
  if (!statue) return <p>Loading statue details...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{statue.name}</h1>
      <img
        src={statue.image}
        alt={statue.name}
        style={{ maxWidth: "500px", borderRadius: "10px" }}
      />
      <p style={{ maxWidth: "600px", margin: "20px auto" }}>
        {statue.description}
      </p>

      {/* Admin-only buttons: Edit & Delete */}
      {user && user.role === "admin" && (
        <>
          <button
            onClick={() => navigate(`/edit/${id}`)}
            style={{
              padding: "10px 20px",
              marginRight: "15px",
              backgroundColor: "orange",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Edit Statue
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Delete Statue
          </button>
        </>
      )}

      {/* Favorites toggle (visible to any logged-in user) */}
      {user && (
        <button
          onClick={handleFavoriteToggle}
          style={{
            padding: "10px 20px",
            marginLeft: "15px",
            backgroundColor: isFavorite ? "red" : "gray",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"}
        </button>
      )}
    </div>
  );
}

export default ElementDetail;

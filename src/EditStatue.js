import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * EditStatue:
 * A component for editing an existing statue record.
 * This page is only accessible to admin users.
 * It fetches the statue details by ID, displays them in
 * a form, and allows updates to name, description, and image URL.
 */
function EditStatue({ user }) {
  // Extract the "id" parameter from the URL (e.g., /edit/:id)
  const { id } = useParams();

  // For programmatic navigation (e.g., after successful edit)
  const navigate = useNavigate();

  // Local states for the statue data and form inputs
  const [statue, setStatue] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Local state for displaying error messages
  const [error, setError] = useState("");

  /**
   * useEffect:
   *  - Fetches the existing statue data when the component mounts or when "id" changes.
   *  - Sets the local form fields (name, description, image) based on the fetched data.
   */
  useEffect(() => {
    axios
      .get(`http://localhost:8081/statues/${id}`)
      .then((response) => {
        setStatue(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
        setImage(response.data.image);
      })
      .catch(() => {
        setError("Error fetching statue details.");
      });
  }, [id]);

  /**
   * handleSubmit:
   *  - Validates admin permissions (user must be admin).
   *  - Checks if any changes were actually made before sending PUT request.
   *  - Updates the statue on the server, then navigates back to the statue's detail page.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only admins can edit statues
    if (!user || user.role !== "admin") {
      alert("Unauthorized access. Only admins can edit statues.");
      return;
    }

    try {
      // Gather only the changed fields in `updatedStatue`
      const updatedStatue = {};

      if (name !== statue.name) updatedStatue.name = name;
      if (description !== statue.description)
        updatedStatue.description = description;
      if (image !== statue.image) updatedStatue.image = image;

      // If no fields have changed, show an error
      if (Object.keys(updatedStatue).length === 0) {
        setError("No changes were made.");
        return;
      }

      // Send PUT request to update the statue
      await axios.put(`http://localhost:8081/statues/${id}`, updatedStatue, {
        withCredentials: true,
      });

      // Alert and navigate back to detail page
      alert("Statue updated successfully!");
      navigate(`/statue/${id}`);
    } catch (err) {
      console.error("Error updating statue:", err);
      setError("Failed to update statue. Please try again.");
    }
  };

  // If there's an error, display it in red at the center
  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  // If statue details haven't loaded yet, show a loading indicator
  if (!statue) {
    return <p style={{ textAlign: "center" }}>Loading statue details...</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Edit Statue</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        {/* Name input */}
        <div style={{ marginBottom: "10px" }}>
          <label>Statue Name:</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        {/* Description input */}
        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label>
          <br />
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        {/* Image URL input */}
        <div style={{ marginBottom: "10px" }}>
          <label>Image URL:</label>
          <br />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update Statue
        </button>
      </form>
    </div>
  );
}

export default EditStatue;

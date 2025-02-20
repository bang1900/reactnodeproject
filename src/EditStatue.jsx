// EditStatue.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/EditStatue.css";

/**
 * EditStatue:
 * A component for editing an existing statue record.
 * Only accessible to admins.
 */
function EditStatue({ user }) {
  // Extract 'id' from URL params
  const { id } = useParams();
  const navigate = useNavigate();

  const [statue, setStatue] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  // Fetch statue details by ID on component mount
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
   *   Validates admin, checks if any fields changed,
   *   then sends a PUT request to update the statue.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      alert("Unauthorized. Only admins can edit statues.");
      return;
    }

    try {
      const updatedStatue = {};
      if (name !== statue.name) updatedStatue.name = name;
      if (description !== statue.description)
        updatedStatue.description = description;
      if (image !== statue.image) updatedStatue.image = image;

      // If no fields changed, show error
      if (Object.keys(updatedStatue).length === 0) {
        setError("No changes were made.");
        return;
      }

      // PUT request with updated fields
      await axios.put(`http://localhost:8081/statues/${id}`, updatedStatue, {
        withCredentials: true,
      });

      alert("Statue updated successfully!");
      navigate(`/statue/${id}`);
    } catch (err) {
      console.error("Error updating statue:", err);
      setError("Failed to update statue. Please try again.");
    }
  };

  if (error) {
    return <p className="editstatue-error">{error}</p>;
  }

  if (!statue) {
    // Loading or statue not found
    return <p className="editstatue-loading">Loading statue details...</p>;
  }

  return (
    <div className="container">
      <h1 className="editstatue-title">Edit Statue</h1>
      {error && <p className="editstatue-error">{error}</p>}

      <form className="editstatue-form" onSubmit={handleSubmit}>
        {/* Statue Name Field */}
        <div className="editstatue-field">
          <label>Statue Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div className="editstatue-field">
          <label>Description:</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Image Field */}
        <div className="editstatue-field">
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <button className="editstatue-submit-btn" type="submit">
          Update Statue
        </button>
      </form>
    </div>
  );
}

export default EditStatue;

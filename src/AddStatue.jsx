import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/AddStatue.css";

/**
 * AddStatue Component
 *
 * Allows an admin user to create a new statue entry by providing:
 *   - Name
 *   - Description
 *   - Image (via file upload or URL)
 *
 * Displays an "Unauthorized" message if accessed by a non-admin user.
 * On successful submission, shows a success message inline and then navigates home.
 */
function AddStatue({ user }) {
  // Local states for the form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // State for error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Check admin privileges; if not admin, show a message inline
  if (!user || user.role !== "admin") {
    return (
      <p className="addstatue-unauthorized">
        Unauthorized. Only admins can add statues.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required.");
      return;
    }

    // Either imageFile or imageUrl must be provided
    if (!imageFile && !imageUrl.trim()) {
      setError("Please provide an image file or a valid image URL.");
      return;
    }

    try {
      // Construct form data for the POST request
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image", imageUrl);
      }

      // Make API call to add the statue
      await axios.post("http://localhost:8081/statues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Display success inline, then navigate home after 2 seconds
      setSuccess("Statue added successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error adding statue:", err);
      setError("Failed to add statue. Please try again.");
    }
  };

  return (
    <div className="addstatue-container">
      <h1 className="addstatue-title">Add a New Statue</h1>

      {/* Inline error/success messages */}
      {error && <p className="addstatue-error">{error}</p>}
      {success && <p className="addstatue-success">{success}</p>}

      <form className="addstatue-form" onSubmit={handleSubmit}>
        {/* Statue Name Field */}
        <div className="addstatue-field">
          <label>Statue Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div className="addstatue-field">
          <label>Description:</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* File Upload Field */}
        <div className="addstatue-field">
          <label>Upload Image (File):</label>
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <p className="addstatue-or">OR</p>

        {/* Image URL Field */}
        <div className="addstatue-field">
          <label>Use Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button className="addstatue-submit-btn" type="submit">
          Add Statue
        </button>
      </form>
    </div>
  );
}

export default AddStatue;

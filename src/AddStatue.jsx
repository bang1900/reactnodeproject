// AddStatue.jsx
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
 * On successful submission, navigates back to the home page.
 */
function AddStatue({ user }) {
  // Local states for the form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  // React Router's hook for programmatic navigation
  const navigate = useNavigate();

  // Check admin privileges; if not admin, show a message and stop.
  if (!user || user.role !== "admin") {
    return (
      <p className="addstatue-unauthorized">
        Unauthorized. Only admins can add statues.
      </p>
    );
  }

  /**
   * handleSubmit
   *
   * Triggered when the form is submitted. Performs validation checks:
   *  - Ensures name and description aren't empty
   *  - Requires either a file or a URL for the image
   * Then sends a POST request (multipart form data) to the backend.
   * If successful, alerts the user and navigates to Home.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload

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

    // Clear any previous errors
    setError("");

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

      // Make API call to add the statue (requires admin)
      await axios.post("http://localhost:8081/statues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // include session cookies
      });

      // Confirm success to the user
      alert("Statue added successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error adding statue:", err);
      setError("Failed to add statue. Please try again.");
    }
  };

  return (
    <div className="addstatue-container">
      <h1 className="addstatue-title">Add a New Statue</h1>

      {/* Display error messages if any */}
      {error && <p className="addstatue-error">{error}</p>}

      {/* Form for statue creation */}
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
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        {/* Separator text */}
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

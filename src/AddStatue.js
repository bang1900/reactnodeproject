// AddStatue.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * AddStatue:
 * Allows an admin user to create a new statue entry by:
 *   - providing a name and description,
 *   - either uploading an image file or specifying an image URL,
 * and then sending a POST request to the server.
 *
 * If the user is not an admin, the component displays
 * a message indicating the user is unauthorized.
 */
function AddStatue({ user }) {
  // Local state for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  // useNavigate hook to redirect after successful addition
  const navigate = useNavigate();

  // If user is not admin, show unauthorized message
  if (!user || user.role !== "admin") {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Unauthorized. Only admins can add statues.
      </p>
    );
  }

  /**
   * handleSubmit:
   *  - Validates that name and description are provided
   *  - Requires either an uploaded file or a direct image URL
   *  - Constructs a FormData object to send to the server
   *  - Redirects to home page on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required.");
      return;
    }

    // Require either file or URL
    if (!imageFile && !imageUrl.trim()) {
      setError("Please provide an image file or a valid image URL.");
      return;
    }

    setError(""); // Clear old errors

    try {
      // Construct the form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      // Choose between file upload or direct URL
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image", imageUrl);
      }

      // Send POST request with form data
      await axios.post("http://localhost:8081/statues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Statue added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding statue:", error);
      setError("Failed to add statue. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Add a New Statue</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form for entering statue details and uploading/setting image */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
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

        <div style={{ marginBottom: "10px" }}>
          <label>Upload Image (File):</label>
          <br />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        <p style={{ margin: "10px 0" }}>OR</p>

        <div style={{ marginBottom: "10px" }}>
          <label>Use Image URL:</label>
          <br />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Add Statue
        </button>
      </form>
    </div>
  );
}

export default AddStatue;

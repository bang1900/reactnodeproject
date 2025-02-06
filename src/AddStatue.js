// AddStatue.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStatue({ statues, setStatues }) {
  // Local state for form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // useNavigate allows us to programmatically navigate back to Home
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new statue object
    const newStatue = {
      id: statues.length + 1, // simplistic ID assignment
      name,
      description,
      // Fallback image if none is provided
      image: image || "https://via.placeholder.com/200",
    };

    // Update the statues array in App.js
    setStatues([...statues, newStatue]);

    // Clear the form fields
    setName("");
    setDescription("");
    setImage("");

    // Optionally navigate back to the Home page
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Add a New Statue</h1>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Statue Name:</label>
          <br />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label>
          <br />
          <textarea
            rows={3}
            cols={30}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Image URL (optional):</label>
          <br />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button type="submit">Add Statue</button>
      </form>
    </div>
  );
}

export default AddStatue;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditStatue({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statue, setStatue] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8081/statues/${id}`) // Fetch single statue by ID
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      alert("Unauthorized access. Only admins can edit statues.");
      return;
    }

    try {
      const updatedStatue = {};

      if (name !== statue.name) updatedStatue.name = name;
      if (description !== statue.description) updatedStatue.description = description;
      if (image !== statue.image) updatedStatue.image = image;

      if (Object.keys(updatedStatue).length === 0) {
        setError("No changes were made.");
        return;
      }

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
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!statue) {
    return <p style={{ textAlign: "center" }}>Loading statue details...</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Edit Statue</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Statue Name:</label>
          <br />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: "8px", width: "100%" }} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label>
          <br />
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: "8px", width: "100%" }} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Image URL:</label>
          <br />
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required style={{ padding: "8px", width: "100%" }} />
        </div>

        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          Update Statue
        </button>
      </form>
    </div>
  );
}

export default EditStatue;

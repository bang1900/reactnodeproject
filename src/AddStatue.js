import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddStatue({ statues, setStatues }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Name and description are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/statues",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newStatue = {
        id: response.data.statueId,
        name,
        description,
        image: response.data.image,
      };
      setStatues([...statues, newStatue]);

      setName("");
      setDescription("");
      setImage(null);

      navigate("/");
    } catch (error) {
      console.error("Error adding statue:", error);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        maxWidth: "500px",
        margin: "40px auto",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{ fontSize: "22px", marginBottom: "15px", fontWeight: "normal" }}
      >
        Add a New Statue
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "15px", width: "90%" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Statue Name:
          </label>
          <input
            type="text"
            required
            placeholder="Enter statue name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", width: "90%" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Description:
          </label>
          <textarea
            rows={3}
            required
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", width: "90%" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{
              width: "100%",
              padding: "5px",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "normal",
          }}
        >
          Add Statue
        </button>
      </form>
    </div>
  );
}

export default AddStatue;

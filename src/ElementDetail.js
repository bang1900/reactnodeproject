import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ElementDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statue, setStatue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User role in ElementDetail:", user?.role); // Debugging

    axios
      .get("http://localhost:8081/statues")
      .then((response) => {
        const foundStatue = response.data.find(
          (item) => item.id === parseInt(id, 10)
        );
        if (foundStatue) {
          setStatue(foundStatue);
        } else {
          setError("Statue not found!");
        }
      })
      .catch(() => {
        setError("Error fetching data from the server.");
      });
  }, [id, user]);

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!statue) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{statue.name}</h1>
      <img
        src={statue.image}
        alt={statue.name}
        style={{ maxWidth: "500px", margin: "20px auto", borderRadius: "10px" }}
      />
      <p style={{ maxWidth: "600px", margin: "20px auto" }}>
        {statue.description}
      </p>

      {user && user.role === "admin" && (
        <button
          onClick={() => navigate(`/edit/${id}`)}
          style={{
            padding: "10px 20px",
            marginTop: "15px",
            backgroundColor: "orange",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Edit Statue
        </button>
      )}
    </div>
  );
}

export default ElementDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ElementDetail() {
  const { id } = useParams(); // Get the ID from the URL
  const [statue, setStatue] = useState(null); // Store statue data
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    // Fetch statue data from the backend
    axios
      .get(`http://localhost:8081/statues`)
      .then((response) => {
        const statues = response.data;
        const foundStatue = statues.find(
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
  }, [id]);

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!statue) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{statue.name}</h1>
      <img
        src={statue.image}
        alt={statue.name}
        style={{ maxWidth: "500px", margin: "20px auto", borderRadius: "10px" }}
      />
      <p style={{ maxWidth: "600px", margin: "20px auto" }}>
        {statue.description}
      </p>
    </div>
  );
}

export default ElementDetail;

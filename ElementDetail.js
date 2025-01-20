// ElementDetail.js
import React from "react";
import { useParams } from "react-router-dom";
import { statues } from "./data";

function ElementDetail() {
  const { id } = useParams();
  const statueId = parseInt(id, 10);

  // Find the statue by its ID
  const statue = statues.find((item) => item.id === statueId);

  if (!statue) {
    return <p style={{ textAlign: "center" }}>Statue not found!</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{statue.name}</h1>
      <img
        src={statue.image}
        alt={statue.name}
        style={{ maxWidth: "500px", margin: "20px auto", borderRadius: "10px" }}
      />
      <p style={{ maxWidth: "600px", margin: "0 auto" }}>
        {statue.description}
      </p>
    </div>
  );
}

export default ElementDetail;

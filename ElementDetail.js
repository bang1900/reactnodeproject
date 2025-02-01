// ElementDetail.js
import React from "react";
import { useParams } from "react-router-dom";

function ElementDetail({ statues }) {
  const { id } = useParams();
  const statueId = parseInt(id, 10);

  // No more import from data.js — we use the props from App.js
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

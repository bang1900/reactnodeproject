import React from "react";
import { useParams } from "react-router-dom";

function ElementDetail({ statues }) {
  const { id } = useParams();
  const statueId = parseInt(id, 10);

  // Find the selected statue
  const statue = statues.find((item) => item.id === statueId);

  console.log("Statue Data:", statue); // ✅ Debugging log

  if (!statue) {
    return <p style={{ textAlign: "center" }}>Statue not found!</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{statue.name}</h1>
      <img
        src={statue.image ? statue.image : "https://via.placeholder.com/200"} // ✅ Use fallback if missing
        alt={statue.name}
        onError={(e) => (e.target.src = "https://via.placeholder.com/200")} // ✅ Handle broken images
        style={{ maxWidth: "500px", margin: "20px auto", borderRadius: "10px" }}
      />
      <p style={{ maxWidth: "600px", margin: "0 auto" }}>
        {statue.description}
      </p>
    </div>
  );
}

export default ElementDetail;

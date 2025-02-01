// Home.js
import React from "react";
import { Link } from "react-router-dom";

// This component no longer has local state.
// It just receives statues from props and displays them.
function Home({ statues }) {
  return (
    <div>
      <h1>Welcome to My Mom's Statue Gallery</h1>
      <p>Click on any statue below to learn more about it!</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {statues.map((statue) => (
          <Link
            key={statue.id}
            to={`/element/${statue.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              textAlign: "center",
            }}
          >
            <img
              src={statue.image}
              alt={statue.name}
              style={{ width: "200px", height: "auto", borderRadius: "10px" }}
            />
            <p style={{ marginTop: "10px" }}>
              <strong>{statue.name}</strong>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

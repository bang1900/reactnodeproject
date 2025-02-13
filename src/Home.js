import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/**
 * Home:
 * Displays a grid of statue images and names,
 * fetched from the server at /statues. Each statue
 * links to its detail page.
 */
function Home() {
  // Local state to store an array of statue objects
  const [statues, setStatues] = useState([]);

  /**
   * useEffect:
   *  - On component mount, send a GET request to /statues
   *  - Store the response (array of statues) in state
   *  - Log errors if fetching fails
   */
  useEffect(() => {
    axios
      .get("http://localhost:8081/statues")
      .then((response) => {
        console.log("API Response:", response.data);
        setStatues(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      {/* Page Heading */}
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Welcome to My Mom's Statue Gallery
      </h1>
      <p style={{ textAlign: "center" }}>
        Click on any statue below to learn more about it!
      </p>

      {/* Grid of statue cards (3 columns per row) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // Ensures 3 images per row
          gap: "20px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* Map through each statue to display an image & link to detail page */}
        {statues.map((statue) => (
          <Link
            key={statue.id}
            to={`/statue/${statue.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              textAlign: "center",
            }}
          >
            <img
              src={statue.image}
              alt={statue.name}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/200")
              }
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
            <p style={{ marginTop: "10px", fontSize: "16px" }}>
              <strong>{statue.name}</strong>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [statues, setStatues] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/statues")
      .then((response) => {
        setStatues(response.data); // Data comes directly from the backend
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
              src={statue.image} // Use the image URL from the API
              alt={statue.name}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/200")
              } // Fallback image
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

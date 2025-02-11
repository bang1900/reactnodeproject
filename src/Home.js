import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [statues, setStatues] = useState([]);

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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Welcome to My Mom's Statue Gallery
      </h1>
      <p style={{ textAlign: "center" }}>
        Click on any statue below to learn more about it!
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // ✅ Ensures 3 images per row
          gap: "20px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
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

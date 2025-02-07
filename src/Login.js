import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8081/login",
        { username, password },
        { withCredentials: true }
      )
      .then((response) => {
        setUser(response.data.user);
        navigate("/");
      })
      .catch(() => {
        setError("Invalid username or password");
      });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "8px", width: "200px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px", width: "200px" }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 15px" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

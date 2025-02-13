import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Login:
 * Renders a form for users to enter their username and password.
 * Sends credentials to the backend (/login) to establish a session.
 * On success, sets the user in the parent state and redirects to Home.
 */
function Login({ setUser }) {
  // Local state for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Local state to store error messages (if login fails)
  const [error, setError] = useState(null);

  // Provides navigation functionality (e.g., after successful login)
  const navigate = useNavigate();

  /**
   * handleSubmit:
   *  - Prevents default form submission
   *  - Sends POST /login request with username and password
   *  - If successful, updates parent state (`setUser`) and redirects to Home
   *  - If not, shows an error message
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8081/login",
        { username, password },
        { withCredentials: true }
      )
      .then((response) => {
        // On success, store the returned user object in App state
        setUser(response.data.user);
        navigate("/"); // Redirect to Home
      })
      .catch(() => {
        // If credentials are invalid or request fails
        setError("Invalid username or password");
      });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Login</h1>

      {/* If there's an error (e.g., bad credentials), display it in red */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Login form */}
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

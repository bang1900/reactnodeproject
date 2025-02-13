// Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * Register:
 * Allows a new user to create an account by providing:
 *   - Username
 *   - Password
 *   - Confirm Password
 * Then sends a POST request to the server at /register.
 */
function Register() {
  // For programmatic navigation (e.g., after registration)
  const navigate = useNavigate();

  // Local state for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Local state for error messages and success messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /**
   * handleSubmit:
   * - Validates form inputs (ensuring non-empty fields and matching passwords)
   * - Sends a POST request to /register with the username/password
   * - Displays success or error messages based on the server response
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear old messages
    setError("");
    setMessage("");

    // Basic validation of required fields
    if (!username || !password || !confirm) {
      setError("All fields are required.");
      return;
    }

    // Check if the two passwords match
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Make the POST request to register the user
      const response = await axios.post(
        "http://localhost:8081/register",
        { username, password },
        { withCredentials: true }
      );

      // If successful, display the success message
      setMessage(response.data.message);

      // Optionally redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);

      // If the server sent an error response, display it; otherwise show a generic error
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Registration failed.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>

      {/* Display error messages (in red) or success messages (in green) */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Registration form */}
      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "6px", width: "200px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "6px", width: "200px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Confirm Password:</label>
          <br />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={{ padding: "6px", width: "200px" }}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

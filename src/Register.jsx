import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Register.css";

/**
 * Register:
 * Allows a new user to create an account by providing:
 *  - Username
 *  - Password
 *  - Confirm Password
 *  - T&C checkbox 
 */
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Example: T&C checkbox
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    // Check password complexity: 8+ chars, letters & digits
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(password)) {
      setError("Password must be at least 8 chars, including letters & digits.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/register",
        { username, password },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Registration failed.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="register-title">Register</h2>

      {error && <p className="register-error">{error}</p>}
      {message && <p className="register-message">{message}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-field">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="register-field">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="register-field">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {/* Example Terms & Conditions */}
        <div className="register-terms">
          <p>
            By registering, you agree not to upload offensive content and to
            respect intellectual property rights.
          </p>
          <label>
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            I agree to the Terms & Conditions
          </label>
        </div>

        <button className="register-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

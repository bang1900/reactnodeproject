import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";

/**
 * Login:
 * Renders a form for users to enter their username and password,
 * then posts to /login.
 */
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
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      {error && <p className="login-error">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="login-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

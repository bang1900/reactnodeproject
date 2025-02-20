/**
 * routes/users.js
 *
 * Handles:
 *  POST /register
 *  POST /login
 *  POST /logout
 *  GET /auth-status
 */
const express = require("express");
const bcrypt = require("bcryptjs");
const dbSingleton = require("../dbSingleton");

const router = express.Router();
const db = dbSingleton.getConnection();

// -----------------
// POST /register
// -----------------
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  // Check if username exists
  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("DB error checking user:", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user
    db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, "user"],
      (err2) => {
        if (err2) {
          console.error("DB error inserting user:", err2);
          return res.status(500).json({ error: "Failed to register user." });
        }
        return res.json({
          message: "User registered successfully. You may now log in.",
        });
      }
    );
  });
});

// -----------------
// POST /login
// -----------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Query DB for user
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("DB error fetching user:", err);
      return res.status(500).json({ error: "Login failed" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    // Compare hashed password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set session user
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    console.log("User logged in:", req.session.user);
    res.json({ message: "Login successful", user: req.session.user });
  });
});

// -----------------
// POST /logout
// -----------------
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// -----------------
// GET /auth-status
// -----------------
router.get("/auth-status", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;

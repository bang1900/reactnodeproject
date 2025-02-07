// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const dbSingleton = require("./dbSingleton.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static images from the "assets" folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Ensure database connection
const db = dbSingleton.getConnection();
console.log("Connected to MySQL Database");

// API Route to Get Statues from Database
app.get("/statues", (req, res) => {
  db.query(
    "SELECT id, name, description, image FROM statues",
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Add the full URL for local images
      const statuesWithImages = results.map((statue) => {
        const isLocalFile = !statue.image.startsWith("http");
        return {
          ...statue,
          image: isLocalFile
            ? `http://localhost:${PORT}/assets/${statue.image}` // Local file
            : statue.image, // URL
        };
      });

      res.json(statuesWithImages);
    }
  );
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Login failed" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = results[0];
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      res.json({ message: "Login successful", user: req.session.user });
    }
  );
});

// Check Authentication Status
app.get("/auth-status", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// User Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// Sample Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

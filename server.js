const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs"); // ✅ For password hashing
const session = require("express-session"); // ✅ For user sessions
const dbSingleton = require("./dbSingleton.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: "your_secret_key", // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static images from the "assets" folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Ensure database connection
const db = dbSingleton.getConnection();
console.log("Connected to MySQL Database");

// ✅ USER REGISTRATION (SIGN UP)
app.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userRole = role || "user"; // Default to 'user' if not specified

  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, userRole],
    (err, results) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ error: "Registration failed" });
      }
      res.json({ message: "User registered successfully!" });
    }
  );
});

// ✅ USER LOGIN
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
        console.error("Login error:", err);
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

// ✅ CHECK AUTHENTICATION STATUS
app.get("/auth-status", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// ✅ USER LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

// API Route to Get a Single Statue by ID
app.get("/statues/:id", (req, res) => {
  const statueId = req.params.id;
  const query = "SELECT id, name, description, image FROM statues WHERE id = ?";

  db.query(query, [statueId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Statue not found" });
    }

    const statue = results[0];
    const isLocalFile = !statue.image.startsWith("http");
    statue.image = isLocalFile
      ? `http://localhost:${PORT}/assets/${statue.image}`
      : statue.image;

    res.json(statue);
  });
});

// API Route to Get All Statues
app.get("/statues", (req, res) => {
  const query = "SELECT id, name, description, image FROM statues";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No statues found in database." });
    }

    // Ensure correct image URL format & fix missing images
    const statuesWithImages = results.map((statue) => ({
      ...statue,
      image: statue.image
        ? `http://localhost:${PORT}/assets/${statue.image}`
        : "https://via.placeholder.com/200", // Default placeholder
    }));

    res.json(statuesWithImages);
  });
});

// API Route to Update a Statue
app.put("/statues/:id", (req, res) => {
  const { name, description, image } = req.body;
  const statueId = req.params.id;

  console.log(`Updating statue with ID: ${statueId}`);
  console.log("Received data:", req.body);

  db.query("SELECT * FROM statues WHERE id = ?", [statueId], (err, results) => {
    if (err) {
      console.error("Database error while fetching statue:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      console.warn(`Statue with ID ${statueId} not found.`);
      return res.status(404).json({ error: "Statue not found" });
    }

    const existingStatue = results[0];
    const updatedName = name || existingStatue.name;
    const updatedDescription = description !== undefined ? description : existingStatue.description;
    const updatedImage = image !== undefined && image.trim() !== "" ? image : existingStatue.image;

    console.log("Updating statue with values:", { updatedName, updatedDescription, updatedImage });

    const updateQuery = "UPDATE statues SET name = ?, description = ?, image = ? WHERE id = ?";
    db.query(updateQuery, [updatedName, updatedDescription, updatedImage, statueId], (err, result) => {
      if (err) {
        console.error("Database error while updating statue:", err);
        return res.status(500).json({ error: "Failed to update statue" });
      }
      console.log("Statue updated successfully.");
      res.json({ message: "Statue updated successfully" });
    });
  });
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("Database error while fetching user:", err);
      return res.status(500).json({ error: "Login failed" });
    }

    if (results.length === 0) {
      console.warn(`User ${username} not found.`);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      console.warn(`Invalid password for user ${username}.`);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    console.log("User logged in successfully:", req.session.user);
    res.json({ message: "Login successful", user: req.session.user });
  });
});

// Check Authentication Status
app.get("/auth-status", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Sample Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

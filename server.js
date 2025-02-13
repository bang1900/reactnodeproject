/**
 * server.js
 *
 * This Express server handles:
 *  1) User Registration (POST /register) with bcrypt-hashed passwords
 *  2) User Login (POST /login) & Logout (POST /logout)
 *  3) Session-based authentication checks
 *  4) CRUD for "statues" (GET, POST, PUT, DELETE) - admin-only for add/edit/delete
 *  5) Favorites feature (POST /favorites, DELETE /favorites/:statue_id, GET /favorites) - for logged-in users
 */

// ---------------------
// Required Dependencies
// ---------------------
const express = require("express"); // Core framework for building web apps
const cors = require("cors"); // Allows cross-origin requests (needed for React dev server)
const dotenv = require("dotenv"); // Loads environment variables from .env file
const bodyParser = require("body-parser"); // Parses incoming request bodies (JSON)
const path = require("path"); // Provides utilities for file and directory paths
const session = require("express-session"); // Manages user sessions
const bcrypt = require("bcryptjs"); // For hashing and verifying passwords
const dbSingleton = require("./dbSingleton.js"); // Singleton for MySQL database connection

// Multer handles file uploads (used for uploading statue images)
const multer = require("multer");

// Load environment variables from .env file (if present)
dotenv.config();

// ---------------------
// Express App Setup
// ---------------------
const app = express();
const PORT = process.env.PORT || 8081; // Port where the server will listen

/**
 * Configure Multer's storage system for statue images.
 * Files will be placed in the "assets" folder with a unique suffix.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination folder for images
    cb(null, path.join(__dirname, "assets"));
  },
  filename: function (req, file, cb) {
    // Generate a unique file name for each uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // e.g., ".jpg"
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage }); // Multer instance using the above storage config

// ---------------------
// Middleware
// ---------------------
app.use(
  cors({
    // Allow requests from React dev server; enable sending credentials
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json()); // Parse JSON bodies in requests

app.use(
  session({
    secret: "your_secret_key", // Replace with a more secure secret in production
    resave: false,
    saveUninitialized: false,
  })
);

/**
 * Serve static images from the "assets" folder.
 * E.g., an uploaded file named "test.jpg" can be accessed via "/assets/test.jpg"
 */
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ---------------------
// Database Connection
// ---------------------
const db = dbSingleton.getConnection();
console.log("Connected to MySQL Database");

/**
 * --------------------------------------
 *  REGISTER a New User  (POST /register)
 * --------------------------------------
 * Validates the username and password,
 * checks if username is taken, hashes
 * the password, and inserts a new user
 * (default role: "user").
 */
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // 1) Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  // 2) Check if username already exists in DB
  const checkQuery = "SELECT id FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error("DB error checking user:", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (results.length > 0) {
      // Found an existing user with this username
      return res.status(400).json({ error: "Username already taken." });
    }

    // 3) If username is free, hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 4) Insert the new user into DB, role defaults to "user"
    const insertQuery =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(insertQuery, [username, hashedPassword, "user"], (err2) => {
      if (err2) {
        console.error("DB error inserting user:", err2);
        return res.status(500).json({ error: "Failed to register user." });
      }
      return res.json({
        message: "User registered successfully. You may now log in.",
      });
    });
  });
});

/**
 * ------------------
 *       LOGIN
 * ------------------
 * Expects username/password in request body,
 * validates them, checks DB, compares hashed password,
 * and sets session user on success.
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate request
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Query DB for user
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("DB error fetching user:", err);
      return res.status(500).json({ error: "Login failed" });
    }
    if (results.length === 0) {
      // No user found with that username
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];

    // Compare provided password with hashed password in DB
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      // Wrong password
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Save user info in session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role, // e.g. 'admin' or 'user'
    };
    console.log("User logged in:", req.session.user);
    res.json({ message: "Login successful", user: req.session.user });
  });
});

/**
 * ------------------
 *      LOGOUT
 * ------------------
 * Destroys the current user's session, clearing authentication.
 */
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    // Clear the session cookie
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

/**
 * ------------------
 *   AUTH-STATUS
 * ------------------
 * Returns { isAuthenticated: true, user } if the user has an active session,
 * otherwise { isAuthenticated: false }.
 */
app.get("/auth-status", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

/**
 * ------------------
 *     STATUES
 * ------------------
 * These routes handle CRUD for "statues".
 * Admin-only for POST (add), PUT (update), DELETE (remove).
 * Anyone can GET (read) all or one statue.
 */

// GET ALL STATUES
app.get("/statues", (req, res) => {
  const query = "SELECT id, name, description, image FROM statues";
  db.query(query, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (!results.length) {
      return res.status(404).json({ error: "No statues found" });
    }

    // Format image URLs if they're stored locally
    const statuesWithImages = results.map((statue) => ({
      ...statue,
      image: statue.image
        ? `http://localhost:${PORT}/assets/${statue.image}`
        : "https://via.placeholder.com/200",
    }));
    res.json(statuesWithImages);
  });
});

// GET A SINGLE STATUE
app.get("/statues/:id", (req, res) => {
  const statueId = req.params.id;
  const query = "SELECT id, name, description, image FROM statues WHERE id = ?";
  db.query(query, [statueId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (!results.length) {
      return res.status(404).json({ error: "Statue not found" });
    }

    const statue = results[0];
    // If image is stored as a filename, build the local URL
    const isLocalFile = statue.image && !statue.image.startsWith("http");
    if (isLocalFile) {
      statue.image = `http://localhost:${PORT}/assets/${statue.image}`;
    }
    res.json(statue);
  });
});

// ADD A NEW STATUE (ADMIN ONLY)
app.post("/statues", upload.single("image"), (req, res) => {
  // Only admins can add a statue
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, description } = req.body;
  let image = null;

  // If a file was uploaded, use its filename; otherwise, check if an image URL was provided
  if (req.file) {
    image = req.file.filename;
  } else if (req.body.image) {
    image = req.body.image;
  }

  // Validate required fields
  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "Name and description are required." });
  }

  const insertQuery =
    "INSERT INTO statues (name, description, image) VALUES (?, ?, ?)";
  db.query(insertQuery, [name, description, image], (err2) => {
    if (err2) {
      console.error("Error inserting statue:", err2);
      return res.status(500).json({ error: "Failed to add statue" });
    }
    res.json({ message: "Statue added successfully" });
  });
});

// UPDATE A STATUE (ADMIN ONLY)
app.put("/statues/:id", (req, res) => {
  // Only admins can update a statue
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const statueId = req.params.id;
  const { name, description, image } = req.body;

  // First, check if the statue exists
  db.query("SELECT * FROM statues WHERE id = ?", [statueId], (err, results) => {
    if (err) {
      console.error("DB error while fetching statue:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Statue not found" });
    }

    const existing = results[0];
    // If the user didn't provide new values, fallback to existing ones
    const updatedName = name || existing.name;
    const updatedDescription =
      description !== undefined ? description : existing.description;
    const updatedImage =
      image !== undefined && image.trim() !== "" ? image : existing.image;

    const updateQuery =
      "UPDATE statues SET name = ?, description = ?, image = ? WHERE id = ?";
    db.query(
      updateQuery,
      [updatedName, updatedDescription, updatedImage, statueId],
      (err2) => {
        if (err2) {
          console.error("DB error while updating statue:", err2);
          return res.status(500).json({ error: "Failed to update statue" });
        }
        res.json({ message: "Statue updated successfully" });
      }
    );
  });
});

// DELETE A STATUE (ADMIN ONLY)
app.delete("/statues/:id", (req, res) => {
  // Only admins can delete a statue
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized. Admins only." });
  }

  const statueId = req.params.id;
  const query = "DELETE FROM statues WHERE id = ?";
  db.query(query, [statueId], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (result.affectedRows === 0) {
      // No statue found with that ID
      return res.status(404).json({ error: "Statue not found" });
    }
    return res.json({ message: "Statue deleted successfully" });
  });
});

/**
 * ------------------
 *   Favorites
 * ------------------
 * Allows logged-in users to add, remove, and list their favorite statues.
 */

// Add a favorite statue
app.post("/favorites", (req, res) => {
  // Only logged-in users
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { statue_id } = req.body;
  const user_id = req.session.user.id;
  const query = "INSERT INTO favorites (user_id, statue_id) VALUES (?, ?)";

  db.query(query, [user_id, statue_id], (err) => {
    if (err) {
      console.error("DB error:", err);
      // Possibly a unique constraint if already favorited
      return res.status(500).json({ error: "Failed to add to favorites" });
    }
    res.json({ message: "Added to favorites successfully" });
  });
});

// Remove a favorite statue
app.delete("/favorites/:statue_id", (req, res) => {
  // Only logged-in users
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user_id = req.session.user.id;
  const { statue_id } = req.params;
  const query = "DELETE FROM favorites WHERE user_id = ? AND statue_id = ?";

  db.query(query, [user_id, statue_id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to remove from favorites" });
    }
    res.json({ message: "Removed from favorites successfully" });
  });
});

// Get all favorites for the logged-in user
app.get("/favorites", (req, res) => {
  // Only logged-in users
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user_id = req.session.user.id;
  const query = `
    SELECT s.id, s.name, s.description, s.image
    FROM favorites f
    JOIN statues s ON f.statue_id = s.id
    WHERE f.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }

    // Format local images if needed
    const favoritesWithImages = results.map((statue) => {
      if (statue.image && !statue.image.startsWith("http")) {
        statue.image = `http://localhost:${PORT}/assets/${statue.image}`;
      }
      return statue;
    });
    res.json(favoritesWithImages);
  });
});

/**
 * ------------------
 *   Sample Route
 * ------------------
 * Simple route for testing server availability
 */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ---------------------
// Start the server
// ---------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

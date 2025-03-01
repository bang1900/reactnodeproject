/**
 * routes/statues.js
 *
 * Handles:
 *   GET /statues
 *   GET /statues/:id
 *   POST /statues   (admin)
 *   PUT /statues/:id (admin)
 *   DELETE /statues/:id (admin)
 */
const express = require("express");
const path = require("path");
const multer = require("multer");
const dbSingleton = require("../dbSingleton");

const router = express.Router();
const db = dbSingleton.getConnection();

// We need the PORT if you generate full image URLs
const PORT = process.env.PORT || 8081;

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../assets"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// --------------
// GET /statues
// --------------
router.get("/statues", (req, res) => {
  const query = "SELECT id, name, description, image FROM statues";
  db.query(query, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (!results.length) {
      return res.status(404).json({ error: "No statues found" });
    }

    const statuesWithImages = results.map((statue) => ({
      ...statue,
      image: statue.image
        ? `http://localhost:${PORT}/assets/${statue.image}`
        : "https://via.placeholder.com/200",
    }));
    res.json(statuesWithImages);
  });
});

// -----------------
// GET /statues/:id
// -----------------
router.get("/statues/:id", (req, res) => {
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
    if (statue.image && !statue.image.startsWith("http")) {
      statue.image = `http://localhost:${PORT}/assets/${statue.image}`;
    }
    res.json(statue);
  });
});

// -----------------
// POST /statues (admin)
// -----------------
router.post("/statues", upload.single("image"), (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, description } = req.body;
  let image = null;

  if (req.file) {
    image = req.file.filename;
  } else if (req.body.image) {
    image = req.body.image;
  }

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required." });
  }

  db.query(
    "INSERT INTO statues (name, description, image) VALUES (?, ?, ?)",
    [name, description, image],
    (err2) => {
      if (err2) {
        console.error("Error inserting statue:", err2);
        return res.status(500).json({ error: "Failed to add statue" });
      }
      res.json({ message: "Statue added successfully" });
    }
  );
});

// -----------------
// PUT /statues/:id (admin)
// -----------------
router.put("/statues/:id", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const statueId = req.params.id;
  const { name, description, image } = req.body;

  db.query("SELECT * FROM statues WHERE id = ?", [statueId], (err, results) => {
    if (err) {
      console.error("DB error while fetching statue:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Statue not found" });
    }

    const existing = results[0];
    const updatedName = name || existing.name;
    const updatedDescription =
      description !== undefined ? description : existing.description;
    const updatedImage =
      image !== undefined && image.trim() !== "" ? image : existing.image;

    db.query(
      "UPDATE statues SET name = ?, description = ?, image = ? WHERE id = ?",
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

// -----------------
// DELETE /statues/:id (admin)
// -----------------
router.delete("/statues/:id", (req, res) => {
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
      return res.status(404).json({ error: "Statue not found" });
    }
    return res.json({ message: "Statue deleted successfully" });
  });
});

module.exports = router;

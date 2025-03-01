/**
 * routes/favorites.js
 *
 * Handles:
 *   POST /favorites
 *   DELETE /favorites/:statue_id
 *   GET /favorites
 */
const express = require("express");
const dbSingleton = require("../dbSingleton");

const router = express.Router();
const db = dbSingleton.getConnection();

// -----------------
// POST /favorites
// -----------------
router.post("/favorites", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { statue_id } = req.body;
  const user_id = req.session.user.id;
  const query = "INSERT INTO favorites (user_id, statue_id) VALUES (?, ?)";

  db.query(query, [user_id, statue_id], (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to add to favorites" });
    }
    res.json({ message: "Added to favorites successfully" });
  });
});

// -----------------
// DELETE /favorites/:statue_id
// -----------------
router.delete("/favorites/:statue_id", (req, res) => {
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

// -----------------
// GET /favorites
// -----------------
router.get("/favorites", (req, res) => {
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
    results.forEach((statue) => {
      if (statue.image && !statue.image.startsWith("http")) {
        statue.image = `http://localhost:8081/assets/${statue.image}`;
      }
    });
    res.json(results);
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/database");

// POST /api/contact
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Message sent successfully!" });
  });
});

module.exports = router;

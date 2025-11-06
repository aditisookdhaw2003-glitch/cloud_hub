const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to db.json
const dbPath = path.join(__dirname, '..', 'db.json');

// GET /sensors
router.get('/', (req, res) => {
  try {
    const rawData = fs.readFileSync(dbPath);
    const db = JSON.parse(rawData);
    const sensors = db.sensors || [];

    res.json(sensors);
  } catch (err) {
    console.error("Error reading sensors from db.json:", err);
    res.status(500).json({ error: "Failed to load sensors" });
  }
});

module.exports = router;
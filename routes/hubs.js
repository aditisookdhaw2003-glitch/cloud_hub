const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../services/db_service');

// Get all endpoints
router.get('/endpoints', (req, res) => {
  const db = readDB();
  res.json(db.endpoints || []);
});

// Add endpoint (example)
router.post('/endpoints', (req, res) => {
  const db = readDB();
  const newEndpoint = {
    endpoint_id: db.endpoints.length + 1,
    ...req.body
  };
  db.endpoints.push(newEndpoint);
  writeDB(db);
  res.json(newEndpoint);
});

// Sensors list
router.get('/sensors', (req, res) => {
  const db = readDB();
  res.json(db.sensors || []);
});

module.exports = router;
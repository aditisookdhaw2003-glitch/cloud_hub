// routes/logs.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const { verifyAdmin, verifyUser } = require('../middleware/role_middleware');


const fs = require("fs");
const path = require("path");

// ✅ Path to db.json
const dbPath = path.join(__dirname, "..", "db.json");

// Helper: load and save db
function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- GET all clusters ---
router.get("/clusters", authMiddleware, (req, res) => {
  const db = loadDB();
  res.json(db.clusters || []);
});

// --- POST command to cluster ---
router.post("/clusters/:id/command", authMiddleware, (req, res) => {
  const clusterId = parseInt(req.params.id);
  const { command } = req.body;
  const username = req.user?.username || "unknown";

  const db = loadDB();
  const cluster = db.clusters.find(c => c.cluster_id === clusterId);

  if (!cluster) {
    return res.status(404).json({ message: "Cluster not found" });
  }

  const newState = command === "on" ? "on" : "off";
  cluster.current_state = newState;

  db.logs.push({
    log_id: Date.now(),
    username,
    endpoint_id: cluster.endpoint_id,
    node_id: null,
    action: `Cluster ${cluster.type} command: ${command}`,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.json({ message: `Command '${command}' executed on cluster ${clusterId}`, newState });
});

router.get("/", authMiddleware, (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "Start and end required" });
    }

    // Parse and normalize to full UTC day range
    const startTime = new Date(start);
    const endTime = new Date(end);

    // Include the full end day (till 23:59:59)
    endTime.setUTCHours(23, 59, 59, 999);

    // Load DB
    const db = loadDB();
    if (!db.logs || !Array.isArray(db.logs)) {
      return res.status(500).json({ error: "No logs found in db.json" });
    }

    // Filter logs inclusively between start and end
    const filtered = db.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });

    res.json(filtered);
  } catch (err) {
    console.error("❌ Error in GET /logs:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});



module.exports = router;
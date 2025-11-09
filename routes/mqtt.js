// routes/mqtt.js
const express = require("express");
const router = express.Router();
const { publishCommand } = require("../mqttClient");

router.post("/sendCommand", async (req, res) => {
  try {
    const { command } = req.body;

    if (!command || !["ON", "OFF"].includes(command.toUpperCase())) {
      return res.status(400).json({ error: "Invalid command" });
    }

    publishCommand(command.toUpperCase());
    res.json({ status: `Command '${command}' published successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish command" });
  }
});

module.exports = router;
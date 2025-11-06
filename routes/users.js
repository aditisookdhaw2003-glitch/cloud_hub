const express = require("express");
const { getTable, saveTable } = require("../services/db_service");

const router = express.Router();

// Get all users
router.get("/", (req, res) => {
  const users = getTable("users");
  res.json(users);
});

// Get a specific user by ID
router.get("/:id", (req, res) => {
  const users = getTable("users");
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update a user
router.put("/:id", (req, res) => {
  const users = getTable("users");
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "User not found" });

  users[idx] = { ...users[idx], ...req.body };
  saveTable("users", users);

  res.json(users[idx]);
});

// Delete a user
router.delete("/:id", (req, res) => {
  let users = getTable("users");
  users = users.filter(u => u.id !== parseInt(req.params.id));
  saveTable("users", users);
  res.json({ message: "User deleted" });
});

module.exports = router;
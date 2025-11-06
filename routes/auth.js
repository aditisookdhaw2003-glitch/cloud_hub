const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { getTable, saveTable, writeDB } = require("../services/db_service");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password, role, name, surname } = req.body;

  // Get users table
  const users = getTable("users");

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    role: role || "user",
    name: name || "",
    surname: surname || "",
  };

  users.push(newUser);
  saveTable("users", users); // save updated users table

  res.json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password, devicetoken } = req.body;

  const users = getTable("users"); // get users table

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  if (devicetoken) user.devicetoken = devicetoken;
  //if (devicename) user.devicename = devicename;

  saveTable("users", users);

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, surname: user.surname },
    jwtSecret,
    { expiresIn: "1h" }
  );

    res.json({
    token,
    role: user.role,
    name: user.name,
    surname: user.surname,
  });
});

module.exports = router;
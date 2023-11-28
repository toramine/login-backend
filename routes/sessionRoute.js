const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require("../userModel");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;

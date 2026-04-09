const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
try {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });
  res.json({
    msg: "Signup successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
} catch (err) {
  res.status(500).json({ msg: "Server error" });
}
});

router.post("/login", async (req, res) => {
try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    "secret123",
    { expiresIn: "7d" } 
  );
  res.json({
    msg: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
  
} catch (err) {
  res.status(500).json({ msg: "Server error" });
}
});

module.exports = router;
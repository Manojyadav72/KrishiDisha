import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        farmerId: user.farmerId,
        photo: user.photo
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});




// 📥 GET PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ✏️ UPDATE PROFILE
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, photo } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, photo },
    { new: true }
  );

  res.json(user);
});

export default router;
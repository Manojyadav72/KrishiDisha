import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ================= DATABASE ================= */
mongoose.connect("mongodb://127.0.0.1:27017/krishidisha")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ================= MODEL ================= */
const userSchema = new mongoose.Schema({
  name: { type: String, default: "Farmer" },
  email: { type: String, unique: true },
  password: String,
  farmerId: {
    type: String,
    default: () => "FD" + Math.floor(1000 + Math.random() * 9000)
  },
  photo: { type: String, default: "" }
});

const User = mongoose.model("User", userSchema);

/* ================= CHAT ROUTE (UNCHANGED) ================= */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a farming expert. Answer in simple Hindi or English."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log("AI response:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ No response from AI";

    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ reply: "AI error occurred" });
  }
});

/* ================= AUTH ROUTES ================= */

// 🔐 SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name: name || "Farmer",
      email,
      password: hashed
    });

    res.json({ msg: "Signup successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup error" });
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
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
    console.error(err);
    res.status(500).json({ msg: "Login error" });
  }
});

// 🔐 MIDDLEWARE (VERIFY TOKEN)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }

  // 🔥 EXTRACT TOKEN FROM "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

// 👤 UPDATE PROFILE
app.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, photo } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, photo },
      { new: true }
    );

    res.json({
      name: user.name,
      email: user.email,
      farmerId: user.farmerId,
      photo: user.photo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Profile update failed" });
  }
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
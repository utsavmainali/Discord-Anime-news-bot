require("dotenv").config({ path: "../.env" });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const cors = require("cors");
const mongoose = require("mongoose");
const UserXP = require("../models/UserXP");

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3001;

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Dashboard MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Passport
passport.use(new Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/callback",
  scope: ["identify", "guilds"]
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// Auth middleware
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
};

// ── Auth Routes ──
app.get("/auth/discord", passport.authenticate("discord"));

app.get("/auth/callback",
  passport.authenticate("discord", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => res.redirect("http://localhost:5173/dashboard")
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => res.redirect("http://localhost:5173/login"));
});

app.get("/auth/me", isAuth, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar
      ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`,
    guilds: req.user.guilds
  });
});

// ── Leaderboard ──
app.get("/api/leaderboard", isAuth, async (req, res) => {
  try {
    const users = await UserXP.find({}).sort({ level: -1, xp: -1 }).limit(20);
    res.json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ── Stats ──
app.get("/api/stats", isAuth, async (req, res) => {
  try {
    const totalUsers = await UserXP.countDocuments();
    const topUser = await UserXP.findOne({}).sort({ level: -1, xp: -1 });
    const avgXP = await UserXP.aggregate([
      { $group: { _id: null, avg: { $avg: "$xp" } } }
    ]);
    res.json({
      totalUsers,
      topUser,
      avgXP: avgXP[0]?.avg?.toFixed(0) || 0
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ── User Management ──
app.get("/api/users", isAuth, async (req, res) => {
  try {
    const users = await UserXP.find({}).sort({ level: -1, xp: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.patch("/api/users/:userId", isAuth, async (req, res) => {
  try {
    const { xp, level } = req.body;
    const user = await UserXP.findOneAndUpdate(
      { userId: req.params.userId },
      { xp, level },
      { new: true }
    );
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/:userId", isAuth, async (req, res) => {
  try {
    await UserXP.findOneAndDelete({ userId: req.params.userId });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.listen(PORT, () => console.log(`🌐 Dashboard API running on http://localhost:${PORT}`));
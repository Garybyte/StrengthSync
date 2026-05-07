const express = require("express");
const jwt = require("jsonwebtoken");
const Nutrition = require("../models/Nutrition");

const router = express.Router();

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/", auth, async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({ user: req.userId });

    res.json(nutrition || { weight: "", goal: "maintain" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch nutrition data" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { weight, goal } = req.body;

    const nutrition = await Nutrition.findOneAndUpdate(
      { user: req.userId },
      {
        user: req.userId,
        weight,
        goal,
      },
      { new: true, upsert: true }
    );

    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: "Failed to save nutrition data" });
  }
});

module.exports = router;
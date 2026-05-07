const express = require("express");
const jwt = require("jsonwebtoken");
const Progress = require("../models/Progress");

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
    const progress = await Progress.find({ user: req.userId }).sort({
      createdAt: 1,
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch progress data" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const progress = new Progress({
      user: req.userId,
      currentWeight: req.body.currentWeight,
      targetWeight: req.body.targetWeight,
      date: req.body.date,
    });

    await progress.save();

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Failed to save progress data" });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        currentWeight: req.body.currentWeight,
        targetWeight: req.body.targetWeight,
        date: req.body.date,
      },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress entry not found" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Failed to update progress entry" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress entry not found" });
    }

    res.json({ message: "Progress entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete progress entry" });
  }
});

module.exports = router;
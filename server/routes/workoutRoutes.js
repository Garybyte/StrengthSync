const express = require("express");
const jwt = require("jsonwebtoken");
const Workout = require("../models/Workout");

const router = express.Router();

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);

    res.status(401).json({
      message: "Invalid token",
    });
  }
};

router.get("/", auth, async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch workouts",
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.userId,
    });

    await workout.save();

    res.status(201).json(workout);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add workout",
    });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: "Failed to update workout" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({
      message: "Workout deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete workout",
    });
  }
});

module.exports = router;
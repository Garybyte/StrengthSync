const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    exercise: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    sets: {
      type: Number,
    },

    reps: {
      type: Number,
    },

    duration: {
      type: Number,
    },

    calories: {
      type: Number,
    },

    date: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);
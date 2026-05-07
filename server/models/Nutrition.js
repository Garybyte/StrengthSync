const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    goal: {
      type: String,
      default: "maintain",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);
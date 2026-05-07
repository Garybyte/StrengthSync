require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Workout = require("./models/Workout");
const Progress = require("./models/Progress");
const Nutrition = require("./models/Nutrition");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({ email: "test@strengthsync.com" });

    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await User.create({
      name: "Test User",
      email: "test@strengthsync.com",
      password: hashedPassword,
      goals: ["Build muscle", "Track nutrition"],
    });

   await Workout.create([
  {
    user: user._id,
    title: "Upper Body Workout",
    exercise: "Bench Press",
    sets: 4,
    reps: 10,
    duration: 45,
    date: new Date(),
  },
  {
    user: user._id,
    title: "Leg Day",
    exercise: "Squats",
    sets: 5,
    reps: 8,
    duration: 60,
    date: new Date(),
  },
]);

    await Progress.create([
      {
        user: user._id,
        currentWeight: 180,
        targetWeight: 170,
        date: new Date(),
      },
    ]);

    await Nutrition.create({
      user: user._id,
      goal: "Lose Weight",
      weight: 180,
      height: 175,
      age: 22,
      gender: "Male",
      activityLevel: "Moderate",
      calories: 2200,
      protein: 160,
      carbs: 220,
      fats: 70,
    });

    console.log("Seed data added successfully!");
    console.log("Login with:");
    console.log("Email: test@strengthsync.com");
    console.log("Password: password123");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
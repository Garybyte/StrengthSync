import { useEffect, useState } from "react";
import axios from "axios";

const exerciseSuggestions = [
  { name: "Push Ups", category: "Strength", calories: 80 },
  { name: "Squats", category: "Strength", calories: 90 },
  { name: "Bench Press", category: "Strength", calories: 120 },
  { name: "Deadlift", category: "Strength", calories: 140 },
  { name: "Running", category: "Cardio", calories: 250 },
  { name: "Jump Rope", category: "Cardio", calories: 220 },
  { name: "Lunges", category: "Strength", calories: 100 },
  { name: "Plank", category: "Core", calories: 60 },
  { name: "Bicep Curls", category: "Strength", calories: 70 },
  { name: "Shoulder Press", category: "Strength", calories: 95 },
];

function Workouts() {
  const API = import.meta.env.VITE_API_URL;

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const userGoals = Array.isArray(savedUser.goals)
    ? savedUser.goals
    : savedUser.goals
    ? [savedUser.goals]
    : [];

  const [workouts, setWorkouts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    exercise: "",
    category: "",
    sets: "",
    reps: "",
    duration: "",
    calories: "",
    date: "",
  });

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getWorkouts = async () => {
    try {
      const res = await axios.get(`${API}/api/workouts`, authConfig);
      setWorkouts(res.data);
    } catch (error) {
      console.log("GET WORKOUTS ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    getWorkouts();
  }, []);

  const chooseExercise = (item) => {
    setForm({
      ...form,
      title: `${item.name} Workout`,
      exercise: item.name,
      category: item.category,
      calories: item.calories,
    });
  };

  const addWorkout = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/api/workouts`, form, authConfig);

      setForm({
        title: "",
        exercise: "",
        category: "",
        sets: "",
        reps: "",
        duration: "",
        calories: "",
        date: "",
      });

      getWorkouts();
    } catch (error) {
      console.log("ADD WORKOUT ERROR:", error.response?.data || error.message);
      alert("Workout could not be added.");
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await axios.delete(`${API}/api/workouts/${id}`, authConfig);
      getWorkouts();
    } catch (error) {
      console.log("DELETE WORKOUT ERROR:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const totalCalories = workouts.reduce(
    (sum, w) => sum + Number(w.calories || 0),
    0
  );

  const totalMinutes = workouts.reduce(
    (sum, w) => sum + Number(w.duration || 0),
    0
  );

  const totalWorkouts = workouts.length;

  return (
    <div className="container">
      <div className="dashboardHero personalizedHero">
        <div>
          <p className="dashboardTag">WELCOME BACK</p>

          <h1>
            Hey, <span>{savedUser.name || "Athlete"}</span>
          </h1>

          <p className="subtext">
            Your personalized fitness dashboard is ready. Based on your goals,
            we’ll help you stay consistent and track real progress.
          </p>

          <div className="goalPills">
            {userGoals.length > 0 ? (
              userGoals.map((goal) => <span key={goal}>{goal}</span>)
            ) : (
              <span>General Fitness</span>
            )}
          </div>
        </div>

        <div className="profileCard">
          <div className="avatarCircle">
            {(savedUser.name || "A").charAt(0).toUpperCase()}
          </div>

          <h3>{savedUser.name || "Athlete"}</h3>
          <p>{savedUser.email || "Logged in user"}</p>

          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="statsGrid">
        <div className="statBox">
          <h2>{totalWorkouts}</h2>
          <p>Total Workouts</p>
        </div>

        <div className="statBox">
          <h2>{totalCalories}</h2>
          <p>Calories Burned</p>
        </div>

        <div className="statBox">
          <h2>{totalMinutes}</h2>
          <p>Minutes Trained</p>
        </div>
      </div>

      <h2>Suggested Exercises</h2>

      <div className="suggestions">
        {exerciseSuggestions.map((item) => (
          <button type="button" key={item.name} onClick={() => chooseExercise(item)}>
            {item.name}
            <span>{item.category}</span>
          </button>
        ))}
      </div>

      <form onSubmit={addWorkout}>
        <input
          placeholder="Workout Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          placeholder="Exercise"
          value={form.exercise}
          onChange={(e) => setForm({ ...form, exercise: e.target.value })}
          required
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="number"
          placeholder="Sets"
          value={form.sets}
          onChange={(e) => setForm({ ...form, sets: e.target.value })}
        />

        <input
          type="number"
          placeholder="Reps"
          value={form.reps}
          onChange={(e) => setForm({ ...form, reps: e.target.value })}
        />

        <input
          type="number"
          placeholder="Duration in minutes"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <input
          type="number"
          placeholder="Estimated calories"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button type="submit">Add Workout</button>
      </form>

      <div className="cards">
        {workouts.map((workout) => (
          <div className="card" key={workout._id}>
            <h3>{workout.title}</h3>
            <p><strong>Exercise:</strong> {workout.exercise}</p>
            <p><strong>Category:</strong> {workout.category}</p>
            <p><strong>Sets:</strong> {workout.sets}</p>
            <p><strong>Reps:</strong> {workout.reps}</p>
            <p><strong>Duration:</strong> {workout.duration} minutes</p>
            <p><strong>Calories:</strong> {workout.calories}</p>
            <p><strong>Date:</strong> {workout.date}</p>

            <button type="button" onClick={() => deleteWorkout(workout._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
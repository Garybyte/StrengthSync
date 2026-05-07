import { useEffect, useState } from "react";
import axios from "axios";
import "./Nutrition.css";

function Nutrition() {
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL;

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [form, setForm] = useState({
    goal: "",
    weight: "",
    height: "",
    age: "",
    gender: "",
    activityLevel: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const calculateCalories = (
    weight,
    height,
    age,
    gender,
    activityLevel,
    goal
  ) => {
    if (
      !weight ||
      !height ||
      !age ||
      !gender ||
      !activityLevel ||
      !goal
    ) {
      return "";
    }

    let bmr;

    // Mifflin-St Jeor Formula
    if (gender === "Male") {
      bmr =
        10 * (Number(weight) * 0.453592) +
        6.25 * Number(height) -
        5 * Number(age) +
        5;
    } else {
      bmr =
        10 * (Number(weight) * 0.453592) +
        6.25 * Number(height) -
        5 * Number(age) -
        161;
    }

    let multiplier = 1.2;

    switch (activityLevel) {
      case "Light":
        multiplier = 1.375;
        break;

      case "Moderate":
        multiplier = 1.55;
        break;

      case "Active":
        multiplier = 1.725;
        break;

      default:
        multiplier = 1.2;
    }

    let calories = bmr * multiplier;

    if (goal === "Lose Weight") {
      calories -= 500;
    }

    if (goal === "Gain Muscle") {
      calories += 300;
    }

    return Math.round(calories);
  };

  const getNutrition = async () => {
    try {
      const res = await axios.get(
        `${API}/api/nutrition`,
        authConfig
      );

      if (res.data) {
        setForm({
          goal: res.data.goal || "",
          weight: res.data.weight || "",
          height: res.data.height || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
          activityLevel: res.data.activityLevel || "",
          calories: res.data.calories || "",
          protein: res.data.protein || "",
          carbs: res.data.carbs || "",
          fats: res.data.fats || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token || !savedUser.id) {
      window.location.href = "/login";
      return;
    }

    getNutrition();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    updatedForm.calories = calculateCalories(
      updatedForm.weight,
      updatedForm.height,
      updatedForm.age,
      updatedForm.gender,
      updatedForm.activityLevel,
      updatedForm.goal
    );

    setForm(updatedForm);
  };

  const saveNutrition = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API}/api/nutrition`,
        form,
        authConfig
      );

      alert("Nutrition goals saved!");
    } catch (error) {
      console.log(error);
      alert("Failed to save nutrition goals.");
    }
  };

  const deleteNutrition = async () => {
    try {
      await axios.delete(
        `${API}/api/nutrition`,
        authConfig
      );

      setForm({
        goal: "",
        weight: "",
        height: "",
        age: "",
        gender: "",
        activityLevel: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
      });

      alert("Nutrition goals deleted!");
    } catch (error) {
      console.log(error);
      alert("Failed to delete nutrition goals.");
    }
  };

  return (
    <div className="nutrition-page">
      <div className="nutrition-overlay">
        <div className="nutrition-container">
          <h1>Nutrition Tracker</h1>

          <p className="welcome-text">
            Welcome back, {savedUser.name || "Athlete"}!
          </p>

          <form
            onSubmit={saveNutrition}
            className="nutrition-form"
          >
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              required
            >
              <option value="">Select Goal</option>
              <option value="Lose Weight">
                Lose Weight
              </option>
              <option value="Maintain Weight">
                Maintain Weight
              </option>
              <option value="Gain Muscle">
                Gain Muscle
              </option>
            </select>

            <input
              type="number"
              name="weight"
              placeholder="Weight (lbs)"
              value={form.weight}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={form.height}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              required
            >
              <option value="">
                Activity Level
              </option>

              <option value="Light">
                Light Exercise
              </option>

              <option value="Moderate">
                Moderate Exercise
              </option>

              <option value="Active">
                Very Active
              </option>
            </select>

            <input
              type="number"
              name="calories"
              placeholder="Recommended Calories"
              value={form.calories}
              readOnly
            />

            <input
              type="number"
              name="protein"
              placeholder="Protein Goal (g)"
              value={form.protein}
              onChange={handleChange}
            />

            <input
              type="number"
              name="carbs"
              placeholder="Carbs Goal (g)"
              value={form.carbs}
              onChange={handleChange}
            />

            <input
              type="number"
              name="fats"
              placeholder="Fats Goal (g)"
              value={form.fats}
              onChange={handleChange}
            />

            <button type="submit">
              Save Nutrition Goals
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={deleteNutrition}
            >
              Delete Nutrition Goals
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Nutrition;
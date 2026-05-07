import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const goalOptions = [
  "Lose weight",
  "Maintain weight",
  "Gain weight",
  "Gain muscle",
  "Modify my diet",
  "Manage stress",
  "Increase step count"
];

function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    goals: []
  });

  const navigate = useNavigate();

  const toggleGoal = (goal) => {
    if (form.goals.includes(goal)) {
      setForm({
        ...form,
        goals: form.goals.filter((g) => g !== goal)
      });
    } else {
      if (form.goals.length < 3) {
        setForm({
          ...form,
          goals: [...form.goals, goal]
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, form);
      alert("Account created. Please log in.");
      navigate("/login");
    } catch {
      alert("Signup failed. Try another email.");
    }
  };

  return (
    <div className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <h1>Create Account</h1>
            <p>Start your personalized fitness journey.</p>

            <input
              type="text"
              placeholder="Full name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="button" onClick={() => setStep(2)}>
              Continue
            </button>

            <p className="authLink">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Now for your goals</h1>
            <p>Select up to 3 goals so we can personalize your workouts.</p>

            <div className="goalList">
              {goalOptions.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  className={form.goals.includes(goal) ? "goal activeGoal" : "goal"}
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>

            <button type="submit">Finish Sign Up</button>

            <button type="button" className="backBtn" onClick={() => setStep(1)}>
              Back
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Signup;
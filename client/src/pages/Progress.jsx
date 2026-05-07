import { useEffect, useState } from "react";
import axios from "axios";
import "./Progress.jsx";

function Progress() {
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL;

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    currentWeight: "",
    targetWeight: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const getEntries = async () => {
    try {
      const res = await axios.get(
        `${API}/api/progress`,
        authConfig
      );

      setEntries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token || !savedUser.id) {
      window.location.href = "/login";
      return;
    }

    getEntries();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEntry = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API}/api/progress/${editingId}`,
          form,
          authConfig
        );

        setEditingId(null);
      } else {
        await axios.post(
          `${API}/api/progress`,
          form,
          authConfig
        );
      }

      setForm({
        currentWeight: "",
        targetWeight: "",
        date: "",
      });

      getEntries();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(
        `${API}/api/progress/${id}`,
        authConfig
      );

      getEntries();
    } catch (error) {
      console.log(error);
    }
  };

  const editEntry = (entry) => {
    setEditingId(entry._id);

    setForm({
      currentWeight: entry.currentWeight,
      targetWeight: entry.targetWeight,
      date: entry.date?.split("T")[0],
    });
  };

  return (
    <div className="progress-page">
      <div className="progress-overlay">
        <div className="progress-container">
          <h1>Progress Tracker</h1>

          <p className="welcome-text">
            Welcome back, {savedUser.name || "Athlete"}!
          </p>

          <form onSubmit={addEntry} className="progress-form">
            <input
              type="number"
              name="currentWeight"
              placeholder="Current Weight"
              value={form.currentWeight}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="targetWeight"
              placeholder="Target Weight"
              value={form.targetWeight}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <button type="submit">
              {editingId ? "Update Entry" : "Add Progress"}
            </button>
          </form>

          <div className="progress-list">
            {entries.length === 0 ? (
              <p>No progress entries yet.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry._id} className="progress-card">
                  <h3>{entry.date?.split("T")[0]}</h3>

                  <p>
                    Current Weight:
                    <strong> {entry.currentWeight} lbs</strong>
                  </p>

                  <p>
                    Target Weight:
                    <strong> {entry.targetWeight} lbs</strong>
                  </p>

                  <div className="progress-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => editEntry(entry)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteEntry(entry._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
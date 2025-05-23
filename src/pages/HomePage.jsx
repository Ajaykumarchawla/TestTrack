// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTestOptions, formatTestData } from "../services/TestService";
import "../styles/home.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("mcq_current_user");
    setUsername(user);
    setHistory(JSON.parse(localStorage.getItem(`history_${user}`)) || []);

    getTestOptions().then((data) => {
      setTests(formatTestData(data));
    });
  }, []);

  const handleStart = () => {
    if (selectedTest && (durationHours >= 0 || durationMinutes > 0)) {
      const totalSeconds = durationHours * 3600 + durationMinutes * 60;
      localStorage.setItem("selected_test", selectedTest);
      localStorage.setItem("test_time", totalSeconds); // store in seconds
      navigate("/test");
    }
  };

  const calculateAverage = () => {
    if (!history.length) return "N/A";
    const sum = history.reduce((acc, val) => acc + (val.score || 0), 0);
    return (sum / history.length).toFixed(2);
  };

  return (
    <div className="home-container">
      <aside className="sidebar">
        <h3>User: {username}</h3>
        <h4>Test History</h4>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry.testName}: {entry.score}%</li>
          ))}
        </ul>
        <h4>Average Score: {calculateAverage()}%</h4>
      </aside>

      <main className="form-area">
        <h2>Start a New Test</h2>
        <div className="form-group">
          <label>Select Test</label>
          <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}>
            <option value="">--Choose a test--</option>
            {tests.map((test) => (
              <option key={test.value} value={test.value}>{test.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Duration</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              min="0"
              placeholder="Hours"
              value={durationHours}
              onChange={(e) => setDurationHours(parseInt(e.target.value || "0"))}
            />
            <input
              type="number"
              min="0"
              max="59"
              placeholder="Minutes"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value || "0"))}
            />
          </div>
        </div>

        <button onClick={handleStart} className="purple-btn">Start Test</button>
      </main>
    </div>
  );
}

export default HomePage;

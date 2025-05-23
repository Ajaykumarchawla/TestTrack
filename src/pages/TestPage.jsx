// src/pages/TestPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/test.css";

function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const navigate = useNavigate();

  const testPath = localStorage.getItem("selected_test");
  const testTime = localStorage.getItem("test_time") || "00:10:00";
  const testName = testPath.split("/").slice(-1)[0].replace(".json", "");
  const testTopic = testPath.split("/").slice(-3, -1).join(" > ");

  useEffect(() => {
    const seconds = testTime.split(":").reduce((acc, t) => 60 * acc + +t, 0);
    setTimeLeft(seconds);
    fetch(testPath)
      .then((res) => res.json())
      .then((data) => setQuestions(Object.entries(data)));
  }, [testPath]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && started) {
      alert(`Time's up! You attempted ${Object.keys(answers).length} questions.`);
      handleSubmit();
    }
  }, [timeLeft, started]);

  const handleSelect = (qid, opt) => {
    setAnswers({ ...answers, [qid]: opt });
  };
  const handleSubmit = () => {
    let score = 0;
    questions.forEach(([qid, q]) => {
      if (answers[qid] === q["correct option"]["option key"]) score++;
    });

    const percent = ((score / questions.length) * 100).toFixed(2);
    const user = localStorage.getItem("mcq_current_user");
    const history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");
    history.push({ testName, score: percent });
    localStorage.setItem(`history_${user}`, JSON.stringify(history));
    // Save latest answers for results page
    localStorage.setItem("latest_answers", JSON.stringify(answers));


    // Append results for this user for analytics
    const allResultsKey = `results_${user}`;
    const allResults = JSON.parse(localStorage.getItem(allResultsKey) || "[]");
    allResults.push({
      testName,
      testTopic,
      answers,
      questions,
      score: percent,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(allResultsKey, JSON.stringify(allResults));
    navigate("/result");
  };

  const confirmCancel = () => {
    if (showCancelPrompt || window.confirm("Are you sure you want to quit the test?")) {
      if (window.confirm("This will discard all progress. Confirm again to quit.")) {
        navigate("/home");
      }
    } else {
      setShowCancelPrompt(true);
    }
  };

  const confirmFinish = () => {
    if (window.confirm("Are you sure you want to finish the test?")) {
      alert(`Test finished! You attempted ${Object.keys(answers).length} questions.`);
      handleSubmit();
    }
  };

  const renderTimer = () => new Date(timeLeft * 1000).toISOString().substr(11, 8);

  if (!started) {
    return (
      <div className="test-start-popup">
        <h2>{testName}</h2>
        <p>Topic: {testTopic}</p>
        <p>Time: {testTime}</p>
        <button className="purple-btn" onClick={() => setStarted(true)}>Start Test</button>
      </div>
    );
  }

  return (
    <div className="test-page-layout">
      <header className="test-header">
        <div></div>
        <h3>{testTopic}</h3>
        <div>Time Left: {renderTimer()}</div>
      </header>

      <div className="test-body">
        <aside className="test-question-nav">
          {questions.map(([qid], idx) => (
            <div
              key={qid}
              className={`mcq-no ${idx === current ? "active" : ""}`}
              onClick={() => setCurrent(idx)}
            >
              {idx + 1}
            </div>
          ))}
        </aside>

        <main className="question-block">
          <h3>Q{current + 1}: {questions[current][1].Question}</h3>
          <div className="options">
            {Object.entries(questions[current][1].Options).map(([optKey, optVal]) => (
              <label key={optKey}>
                <input
                  type="radio"
                  name={`q_${current}`}
                  checked={answers[questions[current][0]] === optKey}
                  onChange={() => handleSelect(questions[current][0], optKey)}
                />
                {optKey}. {optVal}
              </label>
            ))}
          </div>
        </main>
      </div>

      <footer className="test-footer">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Previous
        </button>

        <button onClick={confirmCancel} className="cancel-btn">Cancel</button>

        <div>
          {current === questions.length - 1 ? (
            <button className="purple-btn" onClick={confirmFinish}>Finish</button>
          ) : (
            <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
              Next
            </button>
          )}
          <button className="purple-btn" onClick={() => alert("Paused. Timer still running.")}>Pause</button>
        </div>
      </footer>
    </div>
  );
}

export default TestPage;

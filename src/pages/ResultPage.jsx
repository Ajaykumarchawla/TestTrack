// src/pages/ResultPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/result.css";

function ResultPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const testPath = localStorage.getItem("selected_test");
  const testName = testPath.split("/").slice(-1)[0].replace(".json", "");
  const testTopic = testPath.split("/").slice(-3, -1).join(" > ");

  useEffect(() => {
    const userAnswers = JSON.parse(localStorage.getItem("latest_answers") || "{}");
    setAnswers(userAnswers);

    fetch(testPath)
      .then((res) => res.json())
      .then((data) => {
        const entries = Object.entries(data);
        setQuestions(entries);

        let correct = 0;
        entries.forEach(([qid, q]) => {
          if (userAnswers[qid] === q["correct option"]["option key"]) correct++;
        });
        setScore(((correct / entries.length) * 100).toFixed(2));
      });
  }, [testPath]);

  return (
    <div className="result-page">
      <h2>Test Result: {testName}</h2>
      <p>Topic: {testTopic}</p>
      <p>Score: {score}%</p>

      <div className="result-list">
        {questions.map(([qid, q], index) => {
          const correctKey = q["correct option"]["option key"];
          const userAnswer = answers[qid];
          const isCorrect = userAnswer === correctKey;

          return (
            <div key={qid} className={`result-item ${isCorrect ? "correct" : "incorrect"}`}>
              <h4>Q{index + 1}: {q.Question}</h4>
              <p><strong>Your Answer:</strong> {userAnswer || "Not Answered"}</p>
              <p><strong>Correct Answer:</strong> {correctKey} - {q["correct option"].description}</p>
            </div>
          );
        })}
      </div>

      <button className="purple-btn" onClick={() => navigate("/home")}>Back to Home</button>
    </div>
  );
}

export default ResultPage;
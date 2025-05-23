// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthService";
import "../styles/auth.css";

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const response = isLoginMode ? login(username, password) : signup(username, password);
    if (response.success) navigate("/home");
    else setError(response.message);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="purple-btn">
          {isLoginMode ? "Login" : "Sign Up"}
        </button>
        <p className="switch-mode" onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
}

export default AuthPage;
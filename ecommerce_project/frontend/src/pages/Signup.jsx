import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/signup/", { username, email, password })
      .then(() => {
        // After signup, auto-login
        api
          .post("/api/token/", { username, password })
          .then((loginRes) => {
            localStorage.setItem("access_token", loginRes.data.access);
            localStorage.setItem("refresh_token", loginRes.data.refresh);
            setMessage("Account created and logged in successfully");
            navigate("/");
          })
          .catch((loginErr) => {
            setMessage("Account created, but login failed. Please log in manually.");
            navigate("/login");
          });
      })
      .catch((err) => {
        setMessage(err.response?.data?.error || "Signup failed");
      });
  };

  return (
    <div>
      <Header />
      <div className="container mt-4" style={{ maxWidth: "400px" }}>
        <h1 className="mb-4">Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Signup</button>
        </form>
        {message && <p className="mt-3">{message}</p>}
        <p className="mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;

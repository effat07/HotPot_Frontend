// src/components/auth/LoginForm.js

import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login({ emailOrUserName: email, password });

    if (result.success && result.user && result.user.role) {
        const role = result.user.role.toUpperCase();
        switch (role) {
            case "ADMIN":
                navigate("/AdminDashBoard");
                break;
            case "CUSTOMER":
                navigate("/user/home");
                break;
            case "RESTAURANT":
                navigate("/RestaurantDashBoard");
                break;
            default:
                // Fallback for unexpected roles
                navigate("/");
        }
    } else if (result.message) {
        // Display error message from the login function
        setError(result.message);
    } else {
        // Generic error message if no specific message is returned
        setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="card shadow"
      style={{
        minWidth: 350,
        maxWidth: 400,
        background: "linear-gradient(135deg, #fffbe6 0%, #fff 100%)",
        border: "none",
        borderRadius: "1rem",
      }}
    >
      <div className="card-body">
        <h3
          className="mb-4 text-center"
          style={{
            color: "#FFC107",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Login
        </h3>
        {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#FFC107" }}>
              Email or Username
            </label>
            <input
              type="text"
              className="form-control"
              style={{
                background: "#fff",
                borderColor: "#FFC107",
                color: "#333",
              }}
              placeholder="Enter email or username"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#FFC107" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              style={{
                background: "#fff",
                borderColor: "#FFC107",
                color: "#333",
              }}
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#FFC107",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 8px rgba(255,193,7,0.15)",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
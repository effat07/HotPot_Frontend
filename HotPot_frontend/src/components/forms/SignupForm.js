import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // Default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await register({
        userName: name,
        email,
        phone,
        password,
        role,
        active: true, // All users are active upon registration
      });

      if (response.success) {
        setSuccess(
          "Account created successfully! You can now log in."
        );
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setRole("CUSTOMER"); // Reset role for next signup
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
          Sign Up
        </h3>
        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}
        {success && (
          <div className="alert alert-success py-2 text-center">{success}</div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label" style={{ color: "#FFC107" }}>
              I am a
            </label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                background: "#fff",
                borderColor: "#FFC107",
                color: "#333",
              }}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT">Restaurant Owner</option>
            </select>
          </div>
          {/* Name, Email, Phone, Password inputs */}
          <div className="mb-3">
            <label className="form-label" style={{ color: "#FFC107" }}>
              Name
            </label>
            <input
              type="text"
              className="form-control"
              style={{
                background: "#fff",
                borderColor: "#FFC107",
                color: "#333",
              }}
              placeholder="Enter your name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#FFC107" }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              style={{
                background: "#fff",
                borderColor: "#FFC107",
                color: "#333",
              }}
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#FFC107" }}>
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              style={{
                background: "#fff",
                borderColor: "#FFC107",
                color: "#333",
              }}
              placeholder="Enter phone number"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
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
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
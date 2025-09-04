import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

const LoginForm = () => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await login({ emailOrUserName: email, password });

    if (result.success) {
      console.log("Logged in role:", result.role);

      if (result.role === "ADMIN") {
        navigate("/AdminDashBoard");  
      } else if (result.role === "CUSTOMER") {
        navigate("/UserHome");
      } else if (result.role === "RESTAURANT") {
        navigate("/RestaurantDashBoard");
      } else {
        navigate("/");
      }
    } else {
      alert(result.message || "Login failed!");
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("Something went wrong while logging in");
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
        <form onSubmit={handleSubmit}>
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

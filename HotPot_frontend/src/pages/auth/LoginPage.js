import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUserName: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { success, message, role } = await login(form);
      if (success) {
        if (role === "CUSTOMER") {
          navigate("/UserHome");
        } else if (role === "RESTAURANT") {
          navigate("/RestaurantDashboard");
        } else if (role === "ADMIN") {
          navigate("/AdminDashboard");
        }
      } else {
        setError(message);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center" style={{ color: "#FFC107" }}>Login</h2>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <input type="text" className="form-control" name="emailOrUserName" value={form.emailOrUserName} onChange={handleChange} placeholder="Email or Username" required />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
              </div>
              <button type="submit" className="btn btn-warning text-white w-100 fw-bold" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/signup" style={{ color: "#FFC107" }}>Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
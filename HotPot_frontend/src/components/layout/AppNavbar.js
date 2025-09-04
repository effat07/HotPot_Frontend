import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppNavbar({ role = "guest", userName = "" }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/restaurants?search=${encodeURIComponent(q)}`);
  };

  const isUser = role === "user";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-warning sticky-top"
      style={{
        boxShadow: "0 2px 8px rgba(255,193,7,0.15)",
        borderBottom: "2px solid #fffbe6",
        padding: "0.5rem 0",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            color: "#fff",
            fontSize: "1.7rem",
            letterSpacing: "2px",
            textShadow: "0 1px 4px #FFC107",
          }}
        >
          HotPot
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/restaurants" className="nav-link">
                Restaurants
              </NavLink>
            </li>

            {isUser && (
              <>
                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    Cart
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/MyOrder" className="nav-link">
                    My Orders
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Search bar */}
          <form
            className="d-flex me-lg-3 mb-2 mb-lg-0"
            onSubmit={onSearch}
            role="search"
          >
            <input
              className="form-control"
              type="search"
              placeholder="Search for cuisines, dishes, restaurants…"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* Right-side buttons */}
          {isUser ? (
            <div className="d-flex gap-2">
              <Link to="/Profile" className="btn btn-dark">
                {userName || "Profile"}
              </Link>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-dark">
                Login
              </Link>
              <Link to="/signup" className="btn btn-dark">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

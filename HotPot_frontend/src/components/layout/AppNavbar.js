// src/components/layout/AppNavbar.js

import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AppNavbar() {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");
    
    const isCustomer = user?.role === "CUSTOMER";
    const isRestaurantOwner = user?.role === "RESTAURANT";
    const isAdmin = user?.role === "ADMIN";
    const userName = user?.userName || "";

    const onSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (q) navigate(`/restaurants?search=${encodeURIComponent(q)}`);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (loading) {
      return null;
    }

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
                        {isCustomer && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/Cart" className="nav-link">
                                        Cart
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/Myorder" className="nav-link">
                                        My Orders
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {isRestaurantOwner && (
                            <li className="nav-item">
                                <NavLink to="/RestaurantDashboard" className="nav-link">
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                        {isAdmin && (
                            <li className="nav-item">
                                <NavLink to="/AdminDashBoard" className="nav-link">
                                    Admin Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {user ? (
                        <div className="d-flex gap-2">
                            <Link to="/Profile" className="btn btn-dark">
                                {userName || "Profile"}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline-dark">
                                Logout
                            </button>
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
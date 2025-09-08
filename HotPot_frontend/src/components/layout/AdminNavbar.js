

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminNavbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/AdminDashBoard">
                    Admin Dashboard
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#adminNavbarContent"
                    aria-controls="adminNavbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="adminNavbarContent">
                    <div className="d-flex">
                        <button className="btn btn-outline-warning" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
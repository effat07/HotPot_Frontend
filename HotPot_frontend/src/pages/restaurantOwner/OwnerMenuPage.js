// src/pages/restaurantOwner/OwnerMenuPage.js

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuService from "../../services/MenuService";
import RestaurantService from "../../services/RestaurantService";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import { AuthContext } from "../../context/AuthContext";

export default function OwnerMenuPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { user, loading: authLoading } = useContext(AuthContext);

    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const ownerId = user?.userId;
    const role = user?.role;

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!ownerId || role !== "RESTAURANT") {
            setError("Only restaurant owners can access this page.");
            setLoading(false);
            return;
        }

        const fetchMenuData = async () => {
            try {
                setLoading(true);
                const res = await RestaurantService.getRestaurantsByOwner(ownerId);
                const data = Array.isArray(res.data) ? res.data : [res.data];

                if (data.length > 0) {
                    const owned = data[0];
                    setRestaurant(owned);
                    const menuRes = await MenuService.getMenusByRestaurant(owned.restaurantId);
                    setMenuItems(menuRes.data || []);
                } else {
                    setError("No restaurant found for this owner. Please create one first.");
                }
            } catch (err) {
                console.error("Failed to load menu items:", err);
                setError("Failed to load menu items.");
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, [ownerId, role, authLoading]);

    const handleDelete = (menuId) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            MenuService.deleteMenu(menuId)
                .then(() => {
                    setMenuItems((prev) => prev.filter((m) => m.menuId !== menuId));
                })
                .catch(() => setError("Failed to delete menu item."));
        }
    };
    
    if (loading || authLoading) {
        return (
            <>
                <OwnerNavbar />
                <div className="container my-5 text-center">
                    <p className="text-muted">Loading menu...</p>
                </div>
            </>
        );
    }
    
    if (error) {
        return (
            <>
                <OwnerNavbar />
                <div className="container my-5 text-center">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <OwnerNavbar />
            <div className="container my-5">
                <h2 className="text-center fw-bold mb-4" style={{ color: "#FFC107" }}>
                    Manage Menu
                </h2>
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>{restaurant?.restaurantName || "My Restaurant"} - Menu</h4>
                        <button
                            className="btn btn-warning fw-bold"
                            onClick={() => navigate("/owner/menu/add")}
                        >
                            Add New Item
                        </button>
                    </div>

                    {menuItems.length === 0 ? (
                        <p className="text-center text-muted">No menu items found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered align-middle">
                                <thead className="table-warning">
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price (₹)</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.map((item) => (
                                        <tr key={item.menuId}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                {item.inStock ? (
                                                    <span className="badge bg-success">In Stock</span>
                                                ) : (
                                                    <span className="badge bg-danger">Out of Stock</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => navigate(`/owner/menu/edit/${item.menuId}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(item.menuId)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import MenuService from "../../services/MenuService";
import AppNavbar from "../../components/layout/AppNavbar";
import MenuCard from "../../components/cards/MenuCard";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RestaurantMenuPage = () => {
    const { restaurantId } = useParams();
    const { loading: authLoading, user } = useContext(AuthContext);
    const [menus, setMenus] = useState([]);
    const [restaurant, setRestaurant] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (authLoading) {
            return;
        }

        const fetchMenus = async () => {
            try {
                setLoading(true);
                
                const menuRes = await MenuService.getMenusByRestaurant(restaurantId);
                setMenus(menuRes.data);
                setError("");
            } catch (err) {
                console.error("Error fetching menus:", err);
                setError("Failed to load menu items.");
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, [restaurantId, authLoading]);

    if (loading || authLoading) {
        return (
            <>
                <AppNavbar />
                <div className="container my-5 text-center">
                    <div className="spinner-border text-warning" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppNavbar />
                <div className="container my-5 text-center">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <AppNavbar />
            <div className="container mt-4">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h2 className="mb-4" style={{ color: "#FFC107", fontWeight: "bold" }}>Menu</h2>
                <div className="row">
                    {menus.length > 0 ? (
                        menus.map((menu) => (
                            <div key={menu.menuId} className="col-md-3 mb-3">
                                <MenuCard menu={menu} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No menu items available for this restaurant.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default RestaurantMenuPage;
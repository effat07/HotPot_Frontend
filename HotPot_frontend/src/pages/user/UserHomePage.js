import React, { useEffect, useState } from "react";
import AppNavbar from "../../components/layout/AppNavbar";
import RestaurantService from "../../services/RestaurantService";
import MenuService from "../../services/MenuService";
import RestaurantCard from "../../components/cards/RestaurantCard";
import MenuCard from "../../components/cards/MenuCard";
import { Link } from "react-router-dom";

export default function UserHomePage() {
  const role = "user"; // logged-in user role
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [restRes, menuRes] = await Promise.all([
          RestaurantService.getAllRestaurants(),
          MenuService.getAvailableMenus(),
        ]);
        setRestaurants(restRes.data || []);
        setMenus(menuRes.data || []);
      } catch (err) {
        console.error("Error loading data", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Simple search filter (filters menus)
  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AppNavbar role={role} userName="HotPot User" />
      <main className="container py-5">
        <h1 className="mb-3" style={{ color: "#FFC107", fontWeight: "bold" }}>
          Welcome back!
        </h1>
        <p className="text-muted">Explore restaurants, check your cart, and manage your orders.</p>

        {/* Search bar */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search for dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-warning">Search</button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" />
          </div>
        ) : (
          <>
            {/* Restaurants */}
            <h2 className="mt-5 mb-3" style={{ color: "#FFC107" }}>
              Restaurants
            </h2>
            <div className="row">
              {restaurants.map((rest) => (
                <div className="col-md-4 mb-4" key={rest.id}>
                  <RestaurantCard restaurant={rest} />
                </div>
              ))}
            </div>

            {/* Popular Dishes */}
            <h2 className="mt-5 mb-3" style={{ color: "#FFC107" }}>
              Popular Dishes
            </h2>
            <div className="row">
              {filteredMenus.map((menu) => (
                <div className="col-md-3 mb-4" key={menu.id}>
                  <MenuCard menu={menu} />
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-5">
              <h4 style={{ color: "#FFC107" }}>Quick Links</h4>
              <div className="d-flex gap-3 mt-3 flex-wrap">
                <Link to="/cart" className="btn btn-warning">
                  My Cart
                </Link>
                <Link to="/orders" className="btn btn-warning">
                  My Orders
                </Link>
                <Link to="/profile" className="btn btn-warning">
                  Profile
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

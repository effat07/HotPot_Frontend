

import React, { useEffect, useState } from "react";
import RestaurantService from "../../services/RestaurantService";
import RestaurantCard from "../../components/cards/RestaurantCard";
import MenuService from "../../services/MenuService";
import MenuCard from "../../components/cards/MenuCard";
import AppNavbar from "../../components/layout/AppNavbar";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [restRes, menuRes] = await Promise.all([
          RestaurantService.getAllRestaurants(),
          MenuService.getAvailableMenus(),
        ]);
        setRestaurants(restRes?.data || []);
        setMenus(menuRes?.data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <AppNavbar />
      <div>
        <img
          src="/images/hero1.jpeg"
          className="d-block w-100"
          alt="Delicious Food"
          style={{ objectFit: "cover", height: "500px" }}
        />
        <div className="text-center mt-3">
          <h2>Welcome to HotPot</h2>
          <p>Discover amazing restaurants near you</p>
        </div>
      </div>
      <main className="container py-5">
        <h1 className="mb-3" style={{ color: "#FFC107", fontWeight: "bold" }}>
          Discover great food near you!
        </h1>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" />
          </div>
        ) : (
          <>
            <h2 className="mt-5 mb-3" style={{ color: "#FFC107" }}>
              Restaurants
            </h2>
            <div className="row">
              {restaurants.map((rest, idx) => (
                <div
                  className="col-md-4 mb-4"
                  key={rest?.id ?? rest?._id ?? `rest-${idx}`}
                >
                  <RestaurantCard restaurant={rest} />
                </div>
              ))}
            </div>
            <h2 className="mt-5 mb-3" style={{ color: "#FFC107" }}>
              Popular Dishes
            </h2>
            <div className="row">
              {menus.map((menu, idx) => (
                <div
                  className="col-md-3 mb-4"
                  key={menu?.id ?? menu?._id ?? `menu-${idx}`}
                >
                  <MenuCard menu={menu} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
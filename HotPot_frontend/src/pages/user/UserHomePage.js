import React, { useEffect, useState } from "react";
import RestaurantService from "../../services/RestaurantService";
import MenuService from "../../services/MenuService";
import RestaurantCard from "../../components/cards/RestaurantCard";
import MenuCard from "../../components/cards/MenuCard";
import UserNavbar from"../../components/layout/AppNavbar";

export default function UserHomePage() {
  const role = "user"; 
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

  const filteredMenus = menus.filter((menu) =>
    menu.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <UserNavbar role={role} userName="HotPot User" />
      <main className="container py-5">
        <h1 className="mb-3" style={{ color: "#FFC107", fontWeight: "bold" }}>
          Welcome back!
        </h1>
        <p className="text-muted">
          Explore restaurants, check your cart, and manage your orders.
        </p>

        

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
              {restaurants.map((rest, index) => (
                <div
                  className="col-md-4 mb-4"
                  key={rest.id || rest.restaurantId || index}
                >
                  <RestaurantCard restaurant={rest} />
                </div>
              ))}
            </div>

            <h2 className="mt-5 mb-3" style={{ color: "#FFC107" }}>
              Popular Dishes
            </h2>
            <div className="row">
              {filteredMenus.map((menu, index) => (
                <div
                  className="col-md-3 mb-4"
                  key={menu.id || menu.menuId || index}
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

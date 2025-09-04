import React, { useEffect, useState } from "react";
import AppNavbar from "../../components/layout/AppNavbar";
import RestaurantService from "../../services/RestaurantService";
import RestaurantCard from "../../components/cards/RestaurantCard";
import MenuService from "../../services/MenuService";
import MenuCard from "../../components/cards/MenuCard";

export default function HomePage() {
  const role = "guest"; // pass guest for non-logged-in users
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
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AppNavbar role={role} />
      <main className="container py-5">
        <h1 className="mb-3" style={{ color: "#FFC107", fontWeight: "bold" }}>
          Discover great food near you
        </h1>

        {/* Search Bar */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search for dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          </>
        )}
      </main>
    </>
  );
}

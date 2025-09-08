// RestaurantCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card shadow-sm h-100"
      style={{ borderRadius: "1rem", border: "none" }}
    >
      <div className="card-body">
        <h5
          className="card-title"
          style={{ color: "#FFC107", fontWeight: "bold" }}
        >
          {restaurant.restaurantName}
        </h5>
        <p className="card-text text-muted">{restaurant.location}</p>
        <button
          className="btn btn-warning"
          style={{ color: "#fff", fontWeight: "bold" }}
          onClick={() =>
            navigate(`/restaurants/${restaurant.restaurantId}/menus`)
          }
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;

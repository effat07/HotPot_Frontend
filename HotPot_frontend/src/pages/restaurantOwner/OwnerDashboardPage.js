// src/pages/restaurantOwner/OwnerDashboardPage.js

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MenuService from "../../services/MenuService";
import RestaurantService from "../../services/RestaurantService";
import OrderService from "../../services/OrderService";
import CreateRestaurantForm from "../../components/forms/CreateRestaurantForm";
import UserService from "../../services/UserService";
import { AuthContext } from "../../context/AuthContext";
import OwnerNavbar from "../../components/layout/OwnerNavbar";

export default function OwnerDashboardPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUserApproved, setIsUserApproved] = useState(false);

  const ownerId = user?.userId;
  const role = user?.role;

  const fetchDashboardData = async () => {
    if (authLoading) {
      return;
    }
    
    if (role !== "RESTAURANT") {
      setError("Access Denied: Only restaurant owners can access this page.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userRes = await UserService.getUserById(ownerId);
      const fetchedUser = userRes.data;

      if (fetchedUser && fetchedUser.active) {
        setIsUserApproved(true);
        const res = await RestaurantService.getRestaurantsByOwner(ownerId);
        const data = Array.isArray(res.data) ? res.data : [res.data];

        if (data.length > 0) {
          const owned = data[0];
          setRestaurant(owned);

          if (owned.active) {
            const [menuRes, orderRes] = await Promise.all([
              MenuService.getMenusByRestaurant(owned.restaurantId),
              OrderService.getOrdersByRestaurant(owned.restaurantId),
            ]);
            setMenuCount(menuRes.data.length || 0);
            setOrderCount(orderRes.data.length || 0);
          }
        } else {
          setRestaurant(null);
        }
      } else {
        setIsUserApproved(false);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      if (err.response?.status === 404) {
        setRestaurant(null);
      } else {
        setError("Failed to load dashboard. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <>
        <OwnerNavbar />
        <div className="container my-5 text-center">
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <OwnerNavbar  />
        <div className="container my-5 text-center">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  if (!isUserApproved) {
    return (
      <>
        <OwnerNavbar />
        <div className="container my-5 text-center">
          <div className="alert alert-warning">
            Your account is pending admin approval. Please wait to be granted access.
          </div>
        </div>
      </>
    );
  }

  if (isUserApproved && !restaurant) {
    return (
      <>
        <OwnerNavbar  />
        <div className="container my-5 text-center">
          <CreateRestaurantForm
            ownerId={ownerId}
            onRestaurantCreated={fetchDashboardData}
          />
        </div>
      </>
    );
  }

  if (restaurant && !restaurant.active) {
    return (
      <>
        <OwnerNavbar  />
        <div className="container my-5 text-center">
          <div className="alert alert-info">
            Your restaurant has been created and is pending admin approval. We will notify you when it's live!
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <OwnerNavbar />
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#FFC107" }}>
          Restaurant Owner Dashboard
        </h2>
          <div className="d-flex flex-column align-items-center gap-4">
              <div className="card shadow border-0 text-center" style={{ width: "22rem" }}>
                  <div className="card-body">
                      <h4 className="card-title fw-bold">
                          {restaurant.restaurantName}
                      </h4>
                      <p className="card-text text-muted">
                          {restaurant.location}
                      </p>
                      <p className="mb-2"> {restaurant.phone}</p>
                      <span className="badge bg-success">Active</span>
                      <hr />
                      
                  </div>
              </div>
              <div className="row w-100 justify-content-center g-4">
                  <div className="col-md-5">
                      <div className="card shadow border-0 text-center h-100">
                          <div className="card-body d-flex flex-column justify-content-center">
                              <h5 className="fw-bold">Menu Items</h5>
                              <p className="display-6 fw-bold text-dark">{menuCount}</p>
                              
                          </div>
                      </div>
                  </div>
                  <div className="col-md-5">
                      <div className="card shadow border-0 text-center h-100">
                          <div className="card-body d-flex flex-column justify-content-center">
                              <h5 className="fw-bold">Orders</h5>
                              <p className="display-6 fw-bold text-dark">{orderCount}</p>
                              
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
// src/components/owner/CreateRestaurantForm.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

export default function CreateRestaurantForm({ ownerId, onRestaurantCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: "",
    phone: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ownerId: ownerId,
        active: false,
      };
      await RestaurantService.createRestaurant(payload);
      onRestaurantCreated();
    } catch (err) {
      console.error("Restaurant creation failed:", err.response?.data || err.message);
      // Extract the error message from the response object
      let errorMessage = "Failed to create restaurant. Please try again.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col-md-8">
        <div className="card shadow p-4">
          <h4 className="card-title text-center fw-bold text-danger">
            Your restaurant is not yet registered.
          </h4>
          <p className="text-center text-muted mb-4">
            Please fill in the details below to register your restaurant for admin approval.
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                className="form-control"
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                pattern="[0-9]{10}"
                title="Phone number must be exactly 10 digits"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-warning fw-bold w-100"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Restaurant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
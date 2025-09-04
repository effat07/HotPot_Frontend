import React, { useState } from "react";

export default function CheckoutPage() {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully! 🚀 (Backend integration later)");
  };

  return (
    <div className="container py-5">
      <h2 style={{ color: "#FFC107", fontWeight: "bold" }}>Checkout</h2>

      <div className="row mt-4">
        {/* Address Form */}
        <div className="col-md-6">
          <h5 style={{ color: "#FFC107" }}>Delivery Address</h5>
          <form className="mt-3" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={address.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                name="street"
                value={address.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-warning text-white fw-bold w-100">
              Place Order
            </button>
          </form>
        </div>

        {/* Payment */}
        <div className="col-md-6">
          <h5 style={{ color: "#FFC107" }}>Payment</h5>
          <div className="card mt-3 shadow-sm border-0">
            <div className="card-body">
              <p className="text-muted">
                Payment integration coming soon...
              </p>
              <button className="btn btn-outline-warning w-100" disabled>
                Pay Online (Disabled)
              </button>
              <button className="btn btn-success w-100 mt-2">
                Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

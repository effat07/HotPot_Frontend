import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Paneer Tikka", price: 180, quantity: 2 },
    { id: 2, name: "Chicken Biryani", price: 250, quantity: 1 },
  ]);


  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-5">
      <h2 style={{ color: "#FFC107", fontWeight: "bold" }}>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <table className="table align-middle mt-3">
            <thead className="table-warning">
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th style={{ width: "120px" }}>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-warning ms-2"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 style={{ color: "#FFC107", fontWeight: "bold" }}>
              Total: ₹{total}
            </h4>
            <button className="btn btn-warning btn-lg text-white fw-bold">
        <Link to="/checkout" className="text-white text-decoration-none">
            Checkout
        </Link>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

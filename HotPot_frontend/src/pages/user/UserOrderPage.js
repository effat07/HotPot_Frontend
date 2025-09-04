import { useState } from "react";

const dummyOrders = [
  {
    id: 101,
    date: "2025-08-01",
    items: [
      { name: "Paneer Butter Masala", qty: 1, price: 250 },
      { name: "Butter Naan", qty: 2, price: 40 },
    ],
    total: 330,
    status: "Delivered",
  },
  {
    id: 102,
    date: "2025-08-20",
    items: [{ name: "Chicken Biryani", qty: 1, price: 300 }],
    total: 300,
    status: "Pending",
  },
  {
    id: 103,
    date: "2025-08-25",
    items: [
      { name: "Spring Rolls", qty: 2, price: 120 },
      { name: "Gulab Jamun", qty: 1, price: 90 },
    ],
    total: 330,
    status: "Cancelled",
  },
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState(dummyOrders);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">My Orders</h3>

      {orders.length === 0 ? (
        <div className="text-muted">You have no orders yet.</div>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div key={order.id} className="list-group-item mb-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Order #{order.id}</h6>
                  <small className="text-muted">{order.date}</small>
                </div>
                <div>
                  <span
                    className={`badge ${
                      order.status === "Delivered"
                        ? "bg-success"
                        : order.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-1 fw-bold">Total: ₹{order.total}</p>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => toggleExpand(order.id)}
                >
                  {expandedId === order.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expandedId === order.id && (
                <div className="mt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>₹{item.price}</td>
                          <td>₹{item.qty * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

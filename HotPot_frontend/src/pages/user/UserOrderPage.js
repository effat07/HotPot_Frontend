

import React, { useState, useEffect, useContext } from "react";
import AppNavbar from "../../components/layout/AppNavbar";
import OrderService from "../../services/OrderService";
import OrderItemService from "../../services/OrderItemService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserOrderPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const ordersRes = await OrderService.getOrdersByUser(user.userId);
                const fetchedOrders = ordersRes.data || [];

                const ordersWithItems = await Promise.all(
                    fetchedOrders.map(async (order) => {
                        const itemsRes = await OrderItemService.getOrderItemsByOrder(order.orderId);
                        return { ...order, items: itemsRes.data || [] };
                    })
                );

                setOrders(ordersWithItems);
                setError("");
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Failed to load your orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, authLoading, navigate]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading || authLoading) {
        return (
            <>
                <AppNavbar />
                <div className="container my-5 text-center">
                    <div className="spinner-border text-warning" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppNavbar />
                <div className="container my-5 text-center">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <AppNavbar />
            <div className="container py-4">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h3 className="mb-3">My Orders</h3>
                {orders.length === 0 ? (
                    <div className="text-muted">You have no orders yet.</div>
                ) : (
                    <div className="list-group">
                        {orders.map((order) => (
                            <div key={order.orderId} className="card shadow-sm mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center bg-warning text-white">
                                    <h6 className="mb-0">Order</h6>
                                    <span
                                        className={`badge ${
                                            order.status === "DELIVERED" ? "bg-success"
                                                : order.status === "PLACED" || order.status === "PENDING" ? "bg-light text-dark"
                                                    : "bg-danger"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <p className="mb-1 fw-bold">Total: ₹{order.grandTotal.toFixed(2)}</p>
                                    <small className="text-muted">Placed on: {new Date(order.placedAt).toLocaleString()}</small>
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleExpand(order.orderId)}
                                        >
                                            {expandedId === order.orderId ? "Hide Details" : "View Details"}
                                        </button>
                                    </div>
                                    {expandedId === order.orderId && (
                                        <div className="mt-3">
                                            <p className="fw-bold">Items:</p>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Qty</th>
                                                        <th>Price</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((item) => (
                                                        <tr key={item.orderItemId}>
                                                            <td>{item.itemName}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>₹{item.unitPrice.toFixed(2)}</td>
                                                            <td>₹{item.lineTotal.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
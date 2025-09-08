// src/pages/restaurantOwner/OwnerOrdersPage.js

import React, { useState, useEffect, useContext } from "react";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import OrderService from "../../services/OrderService";
import OrderItemService from "../../services/OrderItemService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

export default function OwnerOrdersPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [restaurantId, setRestaurantId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const ownerId = user?.userId;

    const fetchOrders = async () => {
        if (authLoading) return;
        if (!user || user.role !== "RESTAURANT") {
            setError("Access Denied: Only restaurant owners can access this page.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const restaurantRes = await RestaurantService.getRestaurantsByOwner(ownerId);
            const ownedRestaurant = restaurantRes.data?.[0];

            if (ownedRestaurant) {
                setRestaurantId(ownedRestaurant.restaurantId);
                const ordersRes = await OrderService.getOrdersByRestaurant(ownedRestaurant.restaurantId);
                const fetchedOrders = ordersRes.data || [];

                const ordersWithItems = await Promise.all(
                    fetchedOrders.map(async (order) => {
                        const itemsRes = await OrderItemService.getOrderItemsByOrder(order.orderId);
                        return { ...order, items: itemsRes.data || [] };
                    })
                );

                setOrders(ordersWithItems);
                setError("");
            } else {
                setError("No restaurant found for your account. Please create one first.");
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user, authLoading, navigate]);

    // Corrected handleUpdateStatus to match the requested style
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const payload = {
                orderId: orderId,
                status: newStatus,
            };
            await OrderService.updateOrder(payload); // We'll update the service to handle this
            setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update order status:", err);
            setError("Failed to update order status. Please try again.");
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading || authLoading) {
        return (
            <>
                <OwnerNavbar />
                <div className="container my-5 text-center">
                    <div className="spinner-border text-warning" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <OwnerNavbar />
                <div className="container my-5 text-center">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <OwnerNavbar />
            <div className="container py-4">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h3 className="mb-3">Restaurant Orders</h3>
                {orders.length === 0 ? (
                    <div className="text-muted">No orders for your restaurant yet.</div>
                ) : (
                    <div className="list-group">
                        {orders.map((order) => (
                            <div key={order.orderId} className="list-group-item mb-3 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">Order #{order.orderNumber}</h6>
                                        <small className="text-muted">
                                            Placed by {order.user.userName} on {new Date(order.placedAt).toLocaleString()}
                                        </small>
                                    </div>
                                    <div>
                                        <span
                                            className={`badge ${
                                                order.status === "DELIVERED" ? "bg-success"
                                                    : order.status === "PLACED" || order.status === "PENDING" ? "bg-warning text-dark"
                                                        : "bg-danger"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <p className="mb-1"><strong>Total:</strong> ₹{order.grandTotal.toFixed(2)}</p>
                                    <p className="mb-1"><strong>Address:</strong> {order.address}</p>
                                    
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleExpand(order.orderId)}
                                        >
                                            {expandedId === order.orderId ? "Hide Details" : "View Details"}
                                        </button>
                                        
                                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                            <button 
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleUpdateStatus(order.orderId, 'DELIVERED')}
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {expandedId === order.orderId && (
                                    <div className="mt-3">
                                        <p className="fw-bold">Items:</p>
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Qty</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.orderItemId}>
                                                        <td>{item.itemName}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>₹{item.unitPrice.toFixed(2)}</td>
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
        </>
    );
}
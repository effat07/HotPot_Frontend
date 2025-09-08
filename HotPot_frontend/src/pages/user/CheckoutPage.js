

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import { AuthContext } from "../../context/AuthContext";
import AddressService from "../../services/AddressService";
import CartService from "../../services/CartService";
import CartItemService from "../../services/CartItemService";
import OrderService from "../../services/OrderService";
import OrderItemService from "../../services/OrderItemService";

export default function CheckoutPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchCheckoutData = async () => {
            try {
                setLoading(true);
                const [addressesRes, cartRes] = await Promise.all([
                    AddressService.getByUser(user.userId),
                    CartService.getCartByUser(user.userId),
                ]);

                if (cartRes.data) {
                    const cartItemsRes = await CartItemService.getCartItemsByCart(cartRes.data.cartId);
                    setCartItems(cartItemsRes.data);
                    setCart(cartRes.data);
                } else {
                    throw new Error("Cart is empty or not found.");
                }

                setAddresses(addressesRes.data);
                setError("");
            } catch (err) {
                console.error("Failed to fetch checkout data:", err);
                setError("Failed to load checkout details. Your cart may be empty.");
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [user, authLoading, navigate]);

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
        const taxes = subtotal * 0.1;
        const deliveryFee = 20;
        const grandTotal = subtotal + taxes + deliveryFee;
        return { subtotal, taxes, deliveryFee, grandTotal };
    };

    const handlePlaceOrder = async () => {
        setError("");
        setOrderSuccess(false);

        if (!selectedAddressId) {
            setError("Please select a delivery address.");
            return;
        }
        if (!cart || cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        const totals = calculateTotals();
        const selectedAddress = addresses.find(addr => addr.addressId === selectedAddressId);
        
        try {
            const orderPayload = {
                userId: user.userId,
                restaurantId: cart.restaurant.restaurantId,
                orderNumber: new Date().getTime().toString(), 
                address: `${selectedAddress.line1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
                subtotal: totals.subtotal,
                taxes: totals.taxes,
                deliveryFee: totals.deliveryFee,
                grandTotal: totals.grandTotal,
                status: "PLACED",
                paymentStatus: "PENDING",
                placedAt: new Date().toISOString(),
            };
            
            const orderRes = await OrderService.createOrder(orderPayload);
            const orderId = orderRes.data.orderId;

            if (!orderId) {
                throw new Error("Failed to create order, no order ID returned.");
            }

            for (const item of cartItems) {
                const orderItemPayload = {
                    orderId: orderId,
                    menuId: item.menuItem.menuId,
                    itemName: item.menuItem.name,
                    unitPrice: item.itemPrice,
                    quantity: item.quantity,
                    lineTotal: item.itemPrice * item.quantity,
                };
                await OrderItemService.createOrderItem(orderItemPayload);
            }

            await CartService.deleteCart(cart.cartId);

            setOrderSuccess(true);
            setTimeout(() => navigate("/Myorder"), 3000);
            
        } catch (err) {
            console.error("Failed to place order:", err);
            setError("Failed to place your order. Please try again.");
        }
    };
    
    const totals = cartItems.length > 0 ? calculateTotals() : null;

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
                <div className="container py-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }
    
    if (orderSuccess) {
        return (
            <>
                <AppNavbar />
                <div className="container py-5 text-center">
                    <div className="alert alert-success">Order placed successfully! Redirecting to your orders...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <AppNavbar />
            <div className="container py-5">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h2 style={{ color: "#FFC107", fontWeight: "bold" }}>Checkout</h2>

                <div className="row mt-4">
                    <div className="col-md-6 mb-4">
                        <h5 style={{ color: "#FFC107" }}>Delivery Address</h5>
                        {addresses.length === 0 ? (
                            <div className="alert alert-info mt-3">
                                No addresses found. Please add an address on your <Link to="/Profile">profile page</Link>.
                            </div>
                        ) : (
                            <div className="list-group mt-3">
                                {addresses.map((address) => (
                                    <button
                                        key={address.addressId}
                                        type="button"
                                        className={`list-group-item list-group-item-action ${selectedAddressId === address.addressId ? 'active' : ''}`}
                                        onClick={() => setSelectedAddressId(address.addressId)}
                                    >
                                        <p className="mb-1 fw-bold">
                                            {address.line1}, {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        <small className="text-muted">Landmark: {address.landmark}</small>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <h5 style={{ color: "#FFC107" }}>Order Summary & Payment</h5>
                        <div className="card mt-3 shadow-sm border-0">
                            <div className="card-body">
                                {cartItems.map((item) => (
                                    <div key={item.cartItemId} className="d-flex justify-content-between">
                                        <span>{item.quantity} x {item.menuItem.name}</span>
                                        <span>₹{item.itemPrice * item.quantity}</span>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Subtotal:</span>
                                    <span>₹{totals?.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Taxes:</span>
                                    <span>₹{totals?.taxes.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Delivery Fee:</span>
                                    <span>₹{totals?.deliveryFee.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <h5 style={{ color: "#FFC107" }}>Grand Total:</h5>
                                    <h5 style={{ color: "#FFC107" }}>₹{totals?.grandTotal.toFixed(2)}</h5>
                                </div>
                                <div className="mt-3">
                                    <button 
                                        onClick={handlePlaceOrder} 
                                        className="btn btn-success w-100 fw-bold"
                                        disabled={!selectedAddressId || cartItems.length === 0}
                                    >
                                        Pay with Cash on Delivery
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
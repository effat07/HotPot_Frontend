// src/pages/user/CartPage.js

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import { AuthContext } from "../../context/AuthContext";
import CartService from "../../services/CartService";
import CartItemService from "../../services/CartItemService";

export default function CartPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchCart = async () => {
            try {
                setLoading(true);
                const cartRes = await CartService.getCartByUser(user.userId);
                setCartId(cartRes.data.cartId);
                const itemsRes = await CartItemService.getCartItemsByCart(cartRes.data.cartId);
                setCartItems(itemsRes.data);
            } catch (err) {
                console.error("Failed to fetch cart:", err);
                setError("Failed to load your cart. It may be empty or an error occurred.");
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user, authLoading, navigate]);

    const updateQuantity = async (itemId, delta) => {
        const itemToUpdate = cartItems.find(item => item.cartItemId === itemId);
        if (!itemToUpdate) return;
        
        const newQuantity = Math.max(1, itemToUpdate.quantity + delta);
        if (newQuantity === itemToUpdate.quantity) return;

        try {
            await CartItemService.updateCartItem({
                cartItemId: itemId,
                cartId: cartId,
                menuId: itemToUpdate.menuItem.menuId,
                quantity: newQuantity,
                itemPrice: itemToUpdate.itemPrice
            });
            setCartItems(prev =>
                prev.map(item =>
                    item.cartItemId === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error("Failed to update quantity:", err);
            setError("Failed to update item quantity. Please try again.");
        }
    };

    const removeItem = async (itemId) => {
        try {
            await CartItemService.deleteCartItem(itemId);
            setCartItems(prev => prev.filter(item => item.cartItemId !== itemId));
        } catch (err) {
            console.error("Failed to remove item:", err);
            setError("Failed to remove item from cart. Please try again.");
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.itemPrice * item.quantity,
        0
    );

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
    
    return (
        <>
            <AppNavbar />
            <div className="container py-5">
               <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h2 style={{ color: "#FFC107", fontWeight: "bold" }}>Your Cart</h2>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {cartItems.length === 0 ? (
                    <p className="text-muted mt-3">Your cart is empty.</p>
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
                                    <tr key={item.cartItemId}>
                                        <td>{item.menuItem.name}</td>
                                        <td>₹{item.itemPrice}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    onClick={() => updateQuantity(item.cartItemId, -1)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    className="btn btn-sm btn-outline-warning ms-2"
                                                    onClick={() => updateQuantity(item.cartItemId, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>₹{item.itemPrice * item.quantity}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeItem(item.cartItemId)}
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
                            <button className="btn btn-warning btn-lg text-white fw-bold" disabled={cartItems.length === 0}>
                                <Link to="/checkout" className="text-white text-decoration-none">
                                    Checkout
                                </Link>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
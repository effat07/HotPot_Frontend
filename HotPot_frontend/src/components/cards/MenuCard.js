

import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import CartItemService from "../../services/CartItemService";
import CartService from "../../services/CartService";

const MenuCard = ({ menu }) => {
    const { user } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async () => {
        setError("");
        setSuccess("");
        if (!user) {
            setError("You must be logged in to add items to your cart.");
            return;
        }

        try {
            let cartId;
            try {
                const cartRes = await CartService.getCartByUser(user.userId);
                if (!cartRes.data) {
                    throw new Error("Cart not found, creating a new one.");
                }
                cartId = cartRes.data.cartId;
            } catch (cartErr) {
                if (cartErr.response?.status === 404 || cartErr.message === "Cart not found, creating a new one.") {
                   
                    const newCartPayload = {
                        user: { userId: user.userId },
                        restaurant: { restaurantId: menu.restaurant.restaurantId }
                    };
                    const cartRes = await CartService.createCart(newCartPayload);
                    cartId = cartRes.data.cartId;
                } else {
                    throw cartErr;
                }
            }

            const cartItemPayload = {
                cartId: cartId,
                menuId: menu.menuId,
                quantity: quantity,
                itemPrice: menu.price,
                notes: ""
            };
            await CartItemService.createCartItem(cartItemPayload);
            setSuccess("Item added to cart successfully!");
        } catch (err) {
            console.error("Failed to add to cart:", err);
            setError("Failed to add item to cart. Please try again.");
        } finally {
            setShow(false);
        }
    };

    return (
        <>
            <div className="card h-100 shadow-sm" style={{ borderRadius: "1rem", border: "none" }}>
                {menu.image && (
                    <img
                        src={`data:image/jpeg;base64,${menu.image}`}
                        className="card-img-top"
                        alt={menu.name}
                        style={{ height: "150px", objectFit: "cover", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
                    />
                )}
                <div className="card-body">
                    <h6 className="card-title" style={{ color: "#FFC107", fontWeight: "bold" }}>
                        {menu.name}
                    </h6>
                    <p className="card-text text-muted mb-2">
                        {menu.category} • ₹{menu.price}
                    </p>
                    <span
                        className={`badge ${
                            menu.dietaryInfo === "VEG" ? "bg-success"
                                : menu.dietaryInfo === "VEGAN" ? "bg-info"
                                    : "bg-danger"
                        }`}
                        style={{ fontSize: "0.9em" }}
                    >
                        {menu.dietaryInfo}
                    </span>
                    <div className="mt-3">
                        <button
                            className="btn btn-sm btn-warning"
                            style={{ color: "#fff", fontWeight: "bold" }}
                            onClick={() => setShow(true)}
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {success && <div className="alert alert-success mt-2">{success}</div>}

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{menu.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {menu.image && (
                        <img
                            src={`data:image/jpeg;base64,${menu.image}`}
                            className="img-fluid mb-3"
                            alt={menu.name}
                        />
                    )}
                    <p><b>Category:</b> {menu.category}</p>
                    <p><b>Description:</b> {menu.description}</p>
                    <p><b>Dietary Info:</b> {menu.dietaryInfo}</p>
                    <p><b>Taste:</b> {menu.taste}</p>
                    <p><b>Availability:</b> {menu.availabilitySlot}</p>
                    <p><b>Price:</b> ₹{menu.price}</p>
                    <div className="d-flex align-items-center mt-3">
                        <label className="me-2">Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="form-control me-2"
                            style={{ width: "80px" }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button
                        variant="warning"
                        style={{ color: "#fff", fontWeight: "bold" }}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MenuCard;
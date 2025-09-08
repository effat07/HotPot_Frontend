// From AddressPage.js
import React, { useState, useEffect, useContext } from "react";
import AddressForm from "../../components/forms/AddressForm";
import AddressService from "../../services/AddressService";
import { AuthContext } from "../../context/AuthContext";
import AppNavbar from "../../components/layout/AppNavbar";
import { useNavigate } from "react-router-dom";

export default function AddressPage() {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);

    const fetchAddresses = async () => {
        if (!user || !user.userId) {
            setPageLoading(false);
            return;
        }
        setPageLoading(true);
        setError("");
        try {
            const res = await AddressService.getByUser(user.userId);
            setAddresses(res.data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch addresses:", err);
            if (err.response && err.response.status === 401) {
                setError("Session expired. Please log in again.");
                logout();
                navigate("/");
            } else {
                setError("Failed to load addresses.");
            }
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        if (user && !loading) {
            fetchAddresses();
        } else if (!loading) {
            navigate("/");
        }
    }, [user, loading, logout, navigate]);

    const handleAddClick = () => {
        setCurrentAddress(null);
        setShowForm(true);
    };

    const handleEditClick = (address) => {
        setCurrentAddress(address);
        setShowForm(true);
    };

    const handleDeleteClick = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await AddressService.delete(addressId);
                fetchAddresses();
            } catch (err) {
                console.error("Failed to delete address:", err);
                setError("Failed to delete address. Please try again.");
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        setError("");
        try {
            const payload = {
                ...formData,
                userId: user.userId,
            };
            if (formData.addressId) {
                await AddressService.update(payload);
            } else {
                await AddressService.create(payload);
            }
            setShowForm(false);
            fetchAddresses();
        } catch (err) {
            console.error("Failed to save address:", err.response?.data || err.message);
            setError(
                err.response?.data?.message || "Failed to save address. Please try again."
            );
        }
    };

    if (pageLoading || loading) {
        return (
            <>
                <AppNavbar />
                <div className="container my-5 text-center">
                    <p className="text-muted">Loading addresses...</p>
                </div>
            </>
        );
    }

    if (!user) {
        return null; // The useEffect hook will handle navigation
    }

    return (
        <>
            <AppNavbar />
            <div className="container my-5">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#FFC107" }}>
                    My Addresses
                </h2>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {!showForm && (
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-warning fw-bold" onClick={handleAddClick}>
                            Add New Address
                        </button>
                    </div>
                )}
                {!showForm && addresses.length > 0 && (
                    <div className="row">
                        {addresses.map((address) => (
                            <div key={address.addressId} className="col-md-6 mb-4">
                                <div className="card shadow h-100">
                                    <div className="card-body">
                                        <p className="card-text">
                                            {address.line1}, {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        <p className="card-text text-muted">Landmark: {address.landmark}</p>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEditClick(address)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteClick(address.addressId)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {addresses.length === 0 && !showForm && (
                    <p className="text-center text-muted">No addresses saved yet.</p>
                )}
                {showForm && (
                    <AddressForm
                        initialData={currentAddress}
                        onSave={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                )}
            </div>
        </>
    );
}
// src/pages/User/UserProfilePage.js

import React, { useState, useEffect, useContext } from "react";
import UserService from "../../services/UserService";
import AddressService from "../../services/AddressService";
import AppNavbar from "../../components/layout/AppNavbar";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddressForm from "../../components/forms/AddressForm";

export default function UserProfilePage() {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        userId: null,
        userName: "",
        email: "",
        phone: "",
        password: "",
        active: false,
    });
    const [addresses, setAddresses] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user || !user.userId) {
            setError("User session not found. Please log in again.");
            setPageLoading(false);
            logout();
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                const [userRes, addressRes] = await Promise.all([
                    UserService.getUserById(user.userId),
                    AddressService.getByUser(user.userId),
                ]);
                const userData = userRes.data;
                const addressData = addressRes.data;
                
                setProfile({
                    userId: userData.userId,
                    userName: userData.userName,
                    email: userData.email,
                    phone: userData.phone,
                    password: "",
                    active: userData.active,
                });
                setAddresses(addressData);
                setError("");
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                if (err.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                    logout();
                    navigate("/");
                } else {
                    setError("Failed to load user data.");
                }
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [user, loading, logout, navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const payload = {
                userId: profile.userId,
                userName: profile.userName,
                email: profile.email,
                phone: profile.phone,
                active: profile.active,
            };
            if (profile.password) {
                payload.password = profile.password;
            }

            await UserService.updateUser(profile.userId, payload);
            setSuccess("Profile updated successfully!");
            setProfile((prev) => ({ ...prev, password: "" }));
        } catch (err) {
            console.error("Profile update failed:", err);
            setError(
                err.response?.data?.message || "Failed to update profile. Please try again."
            );
        }
    };
    
    // Address management functions
    const handleAddAddressClick = () => {
        setCurrentAddress(null);
        setShowAddressForm(true);
    };

    const handleEditAddressClick = (address) => {
        setCurrentAddress(address);
        setShowAddressForm(true);
    };
    
    const handleDeleteAddressClick = async (addressId) => {
      if (window.confirm("Are you sure you want to delete this address?")) {
        try {
          await AddressService.delete(addressId);
          setAddresses(prev => prev.filter(addr => addr.addressId !== addressId));
        } catch (err) {
          console.error("Failed to delete address:", err);
          setError("Failed to delete address. Please try again.");
        }
      }
    };

    const handleAddressFormSave = async (formData) => {
        try {
            const payload = {
                ...formData,
                userId: profile.userId,
            };

            if (formData.addressId) {
                await AddressService.update(payload);
            } else {
                await AddressService.create(payload);
            }
            setShowAddressForm(false);
            // Re-fetch addresses to get the latest list
            const res = await AddressService.getByUser(profile.userId);
            setAddresses(res.data);
            setSuccess("Address saved successfully!");
        } catch (err) {
            console.error("Failed to save address:", err);
            setError(
                err.response?.data?.message || "Failed to save address. Please try again."
            );
        }
    };
    
    // Conditional rendering for the main page
    if (pageLoading || loading) {
        return (
            <>
              <AppNavbar />
              <div className="container my-5 text-center">
                <p className="text-muted">Loading profile...</p>
              </div>
            </>
        );
    }
    
    if (!user) {
        return (
            <>
              <AppNavbar />
              <div className="container my-5 text-center">
                <div className="alert alert-danger">User not found. Please log in.</div>
              </div>
            </>
        );
    }
    
    return (
        <>
            <AppNavbar />
            <div className="container my-5">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#FFC107" }}>
                    Manage My Profile
                </h2>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {/* Profile Details Card */}
                        <div className="card shadow p-4 mb-4">
                            <h4 className="card-title fw-bold">Personal Details</h4>
                            <form onSubmit={handleProfileSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">User Name</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        className="form-control"
                                        value={profile.userName}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">New Password (optional)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={profile.password}
                                        onChange={handleProfileChange}
                                        placeholder="Enter a new password"
                                    />
                                </div>
                                <button type="submit" className="btn btn-warning w-100 fw-bold">
                                    Update Profile
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-6">
                        {/* Address Management Card */}
                        <div className="card shadow p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title fw-bold">My Addresses</h4>
                                <button className="btn btn-warning btn-sm" onClick={handleAddAddressClick}>
                                    + Add Address
                                </button>
                            </div>

                            {showAddressForm && (
                                <AddressForm
                                    initialData={currentAddress}
                                    onSave={handleAddressFormSave}
                                    onCancel={() => setShowAddressForm(false)}
                                />
                            )}
                            
                            {!showAddressForm && (
                                <div className="row g-3">
                                    {addresses.length > 0 ? (
                                        addresses.map((address) => (
                                            <div className="col-12" key={address.addressId}>
                                                <div className="card shadow-sm h-100">
                                                    <div className="card-body d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <p className="card-text mb-1">
                                                                {address.line1}, {address.city}, {address.state} - {address.pincode}
                                                            </p>
                                                            <small className="text-muted">Landmark: {address.landmark || "N/A"}</small>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => handleEditAddressClick(address)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteAddressClick(address.addressId)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center">No addresses added yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
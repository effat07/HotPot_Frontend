

import React, { useState, useEffect } from "react";

export default function AddressForm({ onSave, onCancel, initialData }) {
    const [form, setForm] = useState({
        addressId: null,
        line1: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                addressId: initialData.addressId,
                line1: initialData.line1 || "",
                city: initialData.city || "",
                state: initialData.state || "",
                pincode: initialData.pincode || "",
                landmark: initialData.landmark || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5 className="card-title mb-3">
                    {form.addressId ? "Edit Address" : "Add Address"}
                </h5>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12">
                        <label className="form-label">Address Line 1</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Address Line 1"
                            name="line1"
                            value={form.line1}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">City</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="State"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Pincode</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pincode"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Landmark (optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Landmark"
                            name="landmark"
                            value={form.landmark}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-12 d-flex gap-2">
                        <button type="submit" className="btn btn-warning">
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
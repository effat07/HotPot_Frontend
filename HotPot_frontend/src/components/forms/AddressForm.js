import { useState, useEffect } from "react";

export default function AddressForm({ onSave, onCancel, initialData }) {
  const [form, setForm] = useState({
    id: null,
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
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
          {form.id ? "Edit Address" : "Add Address"}
        </h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Street"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
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

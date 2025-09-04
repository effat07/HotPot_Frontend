import { useState } from "react";
import AddressForm from "../../components/forms/AddressForm";

const dummyAddresses = [
  { id: 1, street: "123 MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001" },
  { id: 2, street: "45 Park Street", city: "Kolkata", state: "West Bengal", pincode: "700016" },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState(dummyAddresses);
  const [editing, setEditing] = useState(null); 
  const [showForm, setShowForm] = useState(false);

  const handleSave = (address) => {
    if (address.id) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === address.id ? address : a))
      );
    } else {
      const newAddress = { ...address, id: Date.now() };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (address) => {
    setEditing(address);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Addresses</h3>
        <button className="btn btn-warning" onClick={handleAddNew}>
          + Add Address
        </button>
      </div>

      {showForm && (
        <AddressForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="row g-3">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div className="col-md-6" key={address.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">{address.street}</h6>
                  <p className="card-text mb-1">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted">No addresses added yet.</div>
        )}
      </div>
    </div>
  );
}

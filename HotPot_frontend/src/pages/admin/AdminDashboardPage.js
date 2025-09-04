import { useState } from "react";

const dummyUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "USER" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "OWNER" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "USER" },
];

const dummyRestaurants = [
  { id: 1, name: "Spice Hub", owner: "Bob", status: "Active" },
  { id: 2, name: "Sweet Corner", owner: "Alice", status: "Active" },
];

const dummyApprovals = [
  { id: 101, ownerName: "David", email: "david@demo.com", restaurantName: "David’s Kitchen" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState(dummyUsers);
  const [restaurants, setRestaurants] = useState(dummyRestaurants);
  const [approvals, setApprovals] = useState(dummyApprovals);

  // User actions
  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Restaurant actions
  const handleDeleteRestaurant = (id) => {
    setRestaurants(restaurants.filter((r) => r.id !== id));
  };

  // Approvals actions
  const handleApprove = (req) => {
    // Move request to restaurants list
    setRestaurants((prev) => [
      ...prev,
      { id: Date.now(), name: req.restaurantName, owner: req.ownerName, status: "Active" },
    ]);
    setApprovals((prev) => prev.filter((a) => a.id !== req.id));
  };

  const handleReject = (id) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Admin Dashboard</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "restaurants" ? "active" : ""}`}
            onClick={() => setTab("restaurants")}
          >
            Restaurants
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "approvals" ? "active" : ""}`}
            onClick={() => setTab("approvals")}
          >
            Pending Approvals
          </button>
        </li>
      </ul>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>All Users</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-muted text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restaurants Tab */}
      {tab === "restaurants" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>All Restaurants</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Restaurant</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.owner}</td>
                    <td>{r.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteRestaurant(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {restaurants.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-muted text-center">
                      No restaurants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approvals Tab */}
      {tab === "approvals" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Pending Restaurant Approvals</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Restaurant Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.ownerName}</td>
                    <td>{req.email}</td>
                    <td>{req.restaurantName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleApprove(req)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {approvals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-muted text-center">
                      No pending approvals.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

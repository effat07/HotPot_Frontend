import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import RestaurantService from "../../services/RestaurantService";
import AdminNavbar from "../../components/layout/AdminNavbar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await UserService.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await RestaurantService.getAllRestaurants();
      setRestaurants(res.data || []);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRestaurants();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await RestaurantService.deleteRestaurant(id);
        fetchRestaurants();
      } catch (err) {
        console.error("Error deleting restaurant:", err);
      }
    }
  };

  const handleApproveRestaurant = async (restaurantToApprove) => {
    try {
      const updatedRestaurantDto = { ...restaurantToApprove, active: true };
      const res = await RestaurantService.updateRestaurant(updatedRestaurantDto);
      if (res.status === 200) {
        
        fetchRestaurants();
      }
    } catch (err) {
      console.error("Error approving restaurant:", err);
      let errorMessage = "Failed to approve restaurant. Please try again.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      alert(errorMessage);
    }
  };

  return (
    <> 
    <AdminNavbar/>
    <div className="container py-4">

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted">Loading...</div>}

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
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={`user-${u.userId}`}>
                    <td>{u.userId}</td>
                    <td>{u.userName}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.active ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(u.userId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-muted text-center">
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
                  <tr key={`restaurant-${r.restaurantId}`}>
                    <td>{r.restaurantId}</td>
                    <td>{r.restaurantName}</td>
                    <td>{r.owner?.userName || "N/A"}</td>
                    <td>
                      <span className={`badge ${r.active ? "bg-success" : "bg-danger"}`}>
                        {r.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleDeleteRestaurant(r.restaurantId)}
                      >
                        Delete
                      </button>
                      {!r.active && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveRestaurant(r)}
                        >
                          Approve
                        </button>
                      )}
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
    </div>
    </>
  );
}
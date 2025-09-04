import http from "../http-common";

class UserService {
  // Create user
  createUser(user) {
    return http.post(`/api/users`, user);
  }

  // Get user by ID
  getUserById(id) {
    return http.get(`/api/users/${id}`);
  }

  // Update user by ID
  updateUser(id, user) {
    return http.put(`/api/users/${id}`, user);
  }

  // Delete user by ID
  deleteUser(id) {
    return http.delete(`/api/users/${id}`);
  }

  // Get all users
  getAllUsers() {
    return http.get(`/api/users`);
  }

  // Get user by email
  getUserByEmail(email) {
    return http.get(`/api/users/by-email`, { params: { email } });
  }

  // Get user by username
  getUserByUserName(userName) {
    return http.get(`/api/users/by-username`, { params: { userName } });
  }

  // Check if email exists
  existsByEmail(email) {
    return http.get(`/api/users/exists/email`, { params: { email } });
  }

  // Check if username exists
  existsByUserName(userName) {
    return http.get(`/api/users/exists/username`, { params: { userName } });
  }

  // Get users by role
  getUsersByRole(role) {
    return http.get(`/api/users/by-role`, { params: { role } });
  }
}

export default new UserService();

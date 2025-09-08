import http from "../http-common";

class OrderService {
  // Create order
  createOrder(order) {
    return http.post(`/api/orders`, order);
  }

  // Get order by ID
  getOrderById(id) {
    return http.get(`/api/orders/${id}`);
  }

  // Update order
  updateOrder(order) {
    return http.put(`/api/orders`, order);
  }

  // Delete order by ID
  deleteOrder(id) {
    return http.delete(`/api/orders/${id}`);
  }

  // Get all orders
  getAllOrders() {
    return http.get(`/api/orders`);
  }

  // Get orders by user ID
  getOrdersByUser(userId) {
    return http.get(`/api/orders/by-user/${userId}`);
  }

  // Get orders by restaurant ID
  getOrdersByRestaurant(restaurantId) {
    return http.get(`/api/orders/by-restaurant/${restaurantId}`);
  }

  // Get orders by status (PENDING, COMPLETED, CANCELLED, etc.)
  getOrdersByStatus(status) {
    return http.get(`/api/orders/by-status`, { params: { status } });
  }
}

export default new OrderService();

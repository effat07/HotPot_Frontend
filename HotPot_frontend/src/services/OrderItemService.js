import http from "../http-common";

class OrderItemService {
  // Create order item
  createOrderItem(orderItem) {
    return http.post(`/api/order-items`, orderItem);
  }

  // Get order item by ID
  getOrderItemById(id) {
    return http.get(`/api/order-items/${id}`);
  }

  // Update order item
  updateOrderItem(orderItem) {
    return http.put(`/api/order-items`, orderItem);
  }

  // Delete order item by ID
  deleteOrderItem(id) {
    return http.delete(`/api/order-items/${id}`);
  }

  // Get all order items
  getAllOrderItems() {
    return http.get(`/api/order-items`);
  }

  // Get order items by order ID
  getOrderItemsByOrder(orderId) {
    return http.get(`/api/order-items/by-order/${orderId}`);
  }

  // Get order item by order ID + menu ID
  getOrderItemByOrderAndMenu(orderId, menuId) {
    return http.get(`/api/order-items/by-order-and-menu`, {
      params: { orderId, menuId },
    });
  }
}

export default new OrderItemService();

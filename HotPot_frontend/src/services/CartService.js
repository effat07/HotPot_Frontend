import http from "../http-common";

class CartService {
  // Create cart
  createCart(cart) {
    return http.post(`/api/carts`, cart);
  }

  // Get cart by ID
  getCartById(id) {
    return http.get(`/api/carts/${id}`);
  }

  // Update cart
  updateCart(cart) {
    return http.put(`/api/carts`, cart);
  }

  // Delete cart by ID
  deleteCart(id) {
    return http.delete(`/api/carts/${id}`);
  }

  // Get cart by user ID
  getCartByUser(userId) {
    return http.get(`/api/carts/by-user/${userId}`);
  }
}

export default new CartService();

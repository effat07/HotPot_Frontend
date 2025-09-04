import http from "../http-common";

class CartItemService {
  // Create cart item
  createCartItem(cartItemDto) {
    return http.post(`/api/cart-items`, cartItemDto);
  }

  // Get cart item by ID
  getCartItemById(id) {
    return http.get(`/api/cart-items/${id}`);
  }

  // Update cart item
  updateCartItem(cartItemDto) {
    return http.put(`/api/cart-items`, cartItemDto);
  }

  // Delete cart item
  deleteCartItem(id) {
    return http.delete(`/api/cart-items/${id}`);
  }

  // Get all cart items
  getAllCartItems() {
    return http.get(`/api/cart-items`);
  }

  // Get all cart items by cartId
  getCartItemsByCart(cartId) {
    return http.get(`/api/cart-items/by-cart/${cartId}`);
  }

  // Get cart item by cartId and menuId
  getCartItemByCartAndMenu(cartId, menuId) {
    return http.get(`/api/cart-items/by-cart-and-menu`, {
      params: { cartId, menuId },
    });
  }
}

export default new CartItemService();

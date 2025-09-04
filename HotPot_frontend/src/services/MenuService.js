import http from "../http-common";

class MenuService {
  // Create menu item
  createMenu(menu) {
    return http.post(`/api/menus`, menu);
  }

  // Get menu by ID
  getMenuById(id) {
    return http.get(`/api/menus/${id}`);
  }

  // Update menu
  updateMenu(menu) {
    return http.put(`/api/menus`, menu);
  }

  // Delete menu by ID
  deleteMenu(id) {
    return http.delete(`/api/menus/${id}`);
  }

  // Get all menus
  getAllMenus() {
    return http.get(`/api/menus`);
  }

  // Get menus by restaurant ID
  getMenusByRestaurant(restaurantId) {
    return http.get(`/api/menus/by-restaurant/${restaurantId}`);
  }

  // Search menus by name
  searchByName(name) {
    return http.get(`/api/menus/search`, { params: { name } });
  }

  // Get menus by category
  getMenusByCategory(category) {
    return http.get(`/api/menus/by-category/${category}`);
  }

  // Get menus by dietary info (VEG, NON_VEG, VEGAN, etc.)
  getMenusByDietary(dietaryInfo) {
    return http.get(`/api/menus/by-dietary`, { params: { dietaryInfo } });
  }

  // Get menus by taste (SPICY, SWEET, MILD, etc.)
  getMenusByTaste(taste) {
    return http.get(`/api/menus/by-taste`, { params: { taste } });
  }

  // Get menus by availability slot (BREAKFAST, LUNCH, DINNER, etc.)
  getMenusByAvailability(slot) {
    return http.get(`/api/menus/by-availability`, { params: { slot } });
  }

  // Get menus by price range
  getMenusByPriceRange(minPrice, maxPrice) {
    return http.get(`/api/menus/by-price-range`, {
      params: { minPrice, maxPrice },
    });
  }

  // Get only available menus
  getAvailableMenus() {
    return http.get(`/api/menus/available`);
  }
}

export default new MenuService();

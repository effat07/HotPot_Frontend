import http from "../http-common";

class RestaurantService {
  // Create restaurant
  createRestaurant(restaurant) {
    return http.post(`/api/restaurants`, restaurant);
  }

  // Get restaurant by ID
  getRestaurantById(id) {
    return http.get(`/api/restaurants/${id}`);
  }

  // Update restaurant
  updateRestaurant(restaurant) {
    return http.put(`/api/restaurants`, restaurant);
  }

  // Delete restaurant by ID
  deleteRestaurant(id) {
    return http.delete(`/api/restaurants/${id}`);
  }

  // Get all restaurants
  getAllRestaurants() {
    return http.get(`/api/restaurants`);
  }

  // Find restaurants by name
  findByName(restaurantName) {
    return http.get(`/api/restaurants/search/by-name`, {
      params: { restaurantName },
    });
  }

  // Find restaurants by location
  findByLocation(location) {
    return http.get(`/api/restaurants/search/by-location`, {
      params: { location },
    });
  }

  // Get restaurants by owner
getRestaurantsByOwner(ownerId) {
  return http.get(`/api/restaurants/by-owner/${ownerId}`);
}

  // Check if restaurant exists by name
  existsByName(restaurantName) {
    return http.get(`/api/restaurants/exists`, {
      params: { restaurantName },
    });
  }
}

export default new RestaurantService();

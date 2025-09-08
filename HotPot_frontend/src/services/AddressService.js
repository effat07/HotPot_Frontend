import http from "../http-common";

class AddressService {
  // Create address
  create(addressDto) {
    return http.post(`/api/addresses`, addressDto);
  }

  // Get address by id
  getById(id) {
    return http.get(`/api/addresses/${id}`);
  }

  // Update an existing address
  update(addressDto) {
    return http.put(`/api/addresses`, addressDto);
  }

  // Delete address by id
  delete(id) {
    return http.delete(`/api/addresses/${id}`);
  }

  // Get all addresses by userId
  getByUser(userId) {
    return http.get(`/api/addresses/by-user/${userId}`);
  }
}

export default new AddressService();

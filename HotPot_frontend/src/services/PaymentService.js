import http from "../http-common";

class PaymentService {
  // Create payment
  createPayment(payment) {
    return http.post(`/api/payments`, payment);
  }

  // Get payment by ID
  getPaymentById(id) {
    return http.get(`/api/payments/${id}`);
  }

  // Update payment
  updatePayment(payment) {
    return http.put(`/api/payments`, payment);
  }

  // Delete payment by ID
  deletePayment(id) {
    return http.delete(`/api/payments/${id}`);
  }

  // Get all payments
  getAllPayments() {
    return http.get(`/api/payments`);
  }

  // Get payment by order ID
  getPaymentByOrder(orderId) {
    return http.get(`/api/payments/by-order/${orderId}`);
  }

  // Get payments by user ID
  getPaymentsByUser(userId) {
    return http.get(`/api/payments/by-user/${userId}`);
  }

  // Get payments created between two dates
  getPaymentsByCreatedBetween(start, end) {
    return http.get(`/api/payments/by-created-between`, {
      params: { start, end },
    });
  }
}

export default new PaymentService();

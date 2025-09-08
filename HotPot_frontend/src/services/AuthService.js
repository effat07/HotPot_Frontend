import http from "../http-common";

class AuthService {
  login(credentials) {
   
    return http.post(`/api/auth/login`, credentials);
  }

  register(userData) {
    return http.post(`/api/auth/register`, userData);
  }

  refreshToken(refreshToken) {
    return http.post(`/api/auth/refresh`, { refreshToken });
  }

  logout() {
    return http.post(`/api/auth/logout`);
  }
}

export default new AuthService();

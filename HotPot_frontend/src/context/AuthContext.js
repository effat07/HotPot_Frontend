import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setUser({ email: localStorage.getItem("userEmail") });
    }
  }, [token]);

const login = async ({ emailOrUserName, password }) => {
  setLoading(true);
  try {
    const response = await AuthService.login({
      emailOrUserName,
      password,
    });

    
    const { token, user } = response.data;

    setToken(token);
    setUser({ email: user.email, role: user.role });

    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userRole", user.role);

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data || "Login failed",
    };
  } finally {
    setLoading(false);
  }
};



  const register = async (userData) => {
  try {
    await AuthService.register(userData);
    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);

    let message = "Signup failed";

    if (error.response?.data) {
      // If backend sends { message: "...", ... }
      if (typeof error.response.data === "object") {
        message = error.response.data.message || JSON.stringify(error.response.data);
      } else {
        message = error.response.data;
      }
    }

    return {
      success: false,
      message,
    };
  }
};

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

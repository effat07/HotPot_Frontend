// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        const storedUserRole = localStorage.getItem("userRole");
        const storedUserName = localStorage.getItem("userName");
        
        if (storedToken && storedUserId && storedUserRole && storedUserName) {
            setToken(storedToken);
            setUser({
                userId: storedUserId,
                userName: storedUserName,
                role: storedUserRole
            });
        }
        setLoading(false);
    }, []);

    const login = async ({ emailOrUserName, password }) => {
        setLoading(true);
        try {
            const response = await AuthService.login({ emailOrUserName, password });
            const { token, user } = response.data;
            
            localStorage.setItem("token", token);
            localStorage.setItem("userId", user.userId);
            localStorage.setItem("userRole", user.role);
            localStorage.setItem("userName", user.userName);

            setToken(token);
            setUser(user);
            
            setLoading(false);
            return { success: true, role: user.role, user };
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            setLoading(false);
            let message = "Login failed: Invalid credentials.";
            if (error.response?.data?.message) {
                 message = error.response.data.message;
            }
            return {
                success: false,
                message,
            };
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
                if (typeof error.response.data === "object") {
                    message = error.response.data.message || JSON.stringify(error.response.data);
                } else {
                    message = error.response.data;
                }
            }
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout API call failed:", error.message);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.clear();
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
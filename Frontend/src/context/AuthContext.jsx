import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (token) {
      setAccessToken(token);
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const data = response.data?.data || response.data;

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    if (data.accessToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    }

    return response;
  };

  // Update Profile
  const updateProfile = async (formData) => {
    const response = await api.put("/auth/profile", formData);

    const data = response.data?.data || response.data;

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return response;
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    return api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  };

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const response = await api.post("/auth/refresh-token");

      const token =
        response.data?.data?.accessToken ||
        response.data?.accessToken;

      if (token) {
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
      }

      return token;
    } catch (error) {
      await logout();
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        updateProfile,
        changePassword,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
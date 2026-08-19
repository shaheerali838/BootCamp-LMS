import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD USER & SYNC PROFILE =================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing stored user", err);
      }
    }

    if (token) {
      setAccessToken(token);
      // Optional: Fetch fresh profile from backend if online
      api
        .get("/auth/profile")
        .then((res) => {
          const freshUser = res.data?.data?.user || res.data?.user;
          if (freshUser) {
            setUser((prev) => {
              const merged = { ...prev, ...freshUser };
              localStorage.setItem("user", JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(() => {
          // Token expired or server unreachable, fallback to localStorage
        });
    }

    setLoading(false);
  }, []);
  // ============================================================

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

  // ================= UPDATE PROFILE (ADDED / ENHANCED) =================
  // Updates user profile both on backend API and local state/localStorage
  const updateProfile = async (formData) => {
    try {
      let response;
      if (formData instanceof FormData) {
        response = await api.put("/auth/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.put("/auth/profile", formData);
      }
      const data = response.data?.data || response.data;

      if (data.user) {
        setUser((prev) => {
          const updated = { ...prev, ...data.user };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
      return response;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  // Direct image updater helper (handles File, Blob, FormData, or Base64/URL)
  const updateProfileImage = async (imageInput) => {
    if (imageInput instanceof File || imageInput instanceof Blob) {
      const fd = new FormData();
      fd.append("profilePicture", imageInput);
      return updateProfile(fd);
    }
    if (imageInput instanceof FormData) {
      return updateProfile(imageInput);
    }
    return updateProfile({
      profilePicture: imageInput,
      profileImage: imageInput,
    });
  };
  // ====================================================================

  // ================= PASSWORD RECOVERY & CHANGE METHODS (ADDED) =================
  // Forgot Password (sends email with reset link)
  const forgotPassword = async (email) => {
    return api.post("/auth/forgot-password", { email });
  };

  // Reset Password (submits new password with token)
  const resetPassword = async (token, newPassword) => {
    return api.post("/auth/reset-password", { token, newPassword });
  };

  // Change Password (authenticated user)
  const changePassword = async (currentPassword, newPassword) => {
    return api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  };
  // ==============================================================================

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
        updateProfileImage,
        forgotPassword,
        resetPassword,
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
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { accessToken, user } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    setUser(user);

    return response;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      setUser(null);
    }
  };

  // REFRESH TOKEN
  const refreshToken = async () => {
    const response = await api.post("/auth/refresh-token");

    const newAccessToken = response.data.accessToken;

    localStorage.setItem("accessToken", newAccessToken);

    return response;
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response;
  };

  // RESET PASSWORD
  const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });

    return response;
  };

  // CHANGE PASSWORD
  const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });

    return response;
  };

  // REGISTER
  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        refreshToken,
        forgotPassword,
        resetPassword,
        changePassword,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
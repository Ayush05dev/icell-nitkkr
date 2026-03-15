import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get existing token on refresh
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Login failed";
      return { success: false, error: errorMsg };
    }
  };

  const register = async (
    email,
    password,
    name,
    phone = "",
    branch = "",
    year = ""
  ) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
        phone,
        branch,
        year,
      });

      return {
        success: true,
        message:
          response.data?.message ||
          "Registration successful. Please verify your email before login.",
      };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Registration failed";
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

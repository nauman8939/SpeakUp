import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me", {
        withCredentials: true
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      // If cookie auth failed, try token auth
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (tokenError) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", 
        { email, password },
        { withCredentials: true }
      );
      
      // If we got a token in response, store it as fallback
      if (response.data.user.token) {
        localStorage.setItem("token", response.data.user.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.user.token}`;
      }
      
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed. Please try again." 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
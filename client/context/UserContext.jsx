import { createContext, useContext, useState, useEffect } from "react";
import axios from "../src/api/axios";
import Cookies from "js-cookie"; 

const UserContext = createContext();

export const useUser = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user details
  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me", { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      setUser(null); // In case of error (e.g., user not logged in)
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // Periodically check auth status (optional)
  useEffect(() => {
    const interval = setInterval(fetchUser, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, []);

  // Handle logout logic to clear all session data
  const logout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post("/auth/logout", {}, { withCredentials: true });
      
      // Clear frontend state
      setUser(null);
      
      // Redirect to login
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

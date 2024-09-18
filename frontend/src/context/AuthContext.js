import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

// Create the AuthContext with default values
export const AuthContext = createContext();

// AuthProvider component to provide auth context to children
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // Initialize auth state based on token in local storage
    const token = localStorage.getItem("token");

    if (token) {
      // Assume token validation is handled server-side or elsewhere
      setAuth({ token }); // Store token or user data if needed
    } else {
      setAuth(null);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", { username, password });
      const { token } = response.data;
  
      console.log("Login token:", token); // Add this line
  
      localStorage.setItem("token", token);
      setAuth({ token });
    } catch (err) {
      console.error("Error while logging in:", err);
      throw err;
    }
  };  

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

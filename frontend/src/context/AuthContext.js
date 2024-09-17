import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

// Create the AuthContext with default values
export const AuthContext = createContext();

// AuthProvider component to provide auth context to children
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // Fetch and set auth data from local storage or backend
    const fetchAuthData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axiosInstance.get("/auth/me");
          setAuth(response.data);
        }
      } catch (err) {
        console.error("Error while fetching data:", err);
        setAuth(null);
      }
    };

    fetchAuthData();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setAuth(user);
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

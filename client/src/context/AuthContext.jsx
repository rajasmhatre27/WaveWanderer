import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Shuruat mein hi localStorage check karo (Lazy Initialization)
  //    Isse page refresh hone par bhi state bani rehti hai.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state zaroori hai

  useEffect(() => {
    // 2. Jab bhi app load ho (ya token change ho), user ko decode karo
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const decodedUser = jwtDecode(storedToken);

          // Optional: Check karo ki token expire toh nahi ho gaya
          const currentTime = Date.now() / 1000;
          if (decodedUser.exp < currentTime) {
            console.log("Token expired");
            logout();
          } else {
            setToken(storedToken);
            setUser(decodedUser);
          }
        } catch (error) {
          console.error("Invalid token found in storage", error);
          logout();
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false); // Auth check complete
    };

    initializeAuth();
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const decodedUser = jwtDecode(newToken);
      setUser(decodedUser);
    } catch (error) {
      console.error("Error decoding token on login", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // 3. Jab tak hum check kar rahe hain ki user logged in hai ya nahi,
  //    tab tak kuch mat dikhao (ya spinner dikhao) taaki "flash" na ho.
  if (loading) {
    return null; // Ya ek <Spinner />
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

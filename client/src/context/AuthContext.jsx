import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Hum isey install karenge

// 1. Naya "Context" (Global Memory) banana
const AuthContext = createContext(null);

// 2. "Provider" banana - Yeh component poore app ko "memory" provide karega
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // User ki details (id aur role)

  // 3. Jab app pehli baar load ho, toh check karo ki token pehle se hai ya nahi
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        const decodedUser = jwtDecode(storedToken); // Token ko "kholo"
        setUser(decodedUser); // User state ko set karo (ab user.id aur user.role available hai)
      }
    } catch (error) {
      // Token galat ya expire ho gaya toh
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
    }
  }, []);

  // 4. "Login" function - Yeh function hamara LoginPage aur RegisterPage call karega
  const login = (newToken) => {
    localStorage.setItem("token", newToken); // Token ko browser ki memory (localStorage) mein save karo
    setToken(newToken); // State mein save karo
    const decodedUser = jwtDecode(newToken); // Naye token ko "kholo"
    setUser(decodedUser); // User state ko set karo
  };

  // 5. "Logout" function
  const logout = () => {
    localStorage.removeItem("token"); // localStorage se token hatao
    setToken(null);
    setUser(null);
  };

  // 6. Poore app ko yeh values provide karo
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Ek "custom hook" - Isse humein har component mein data access karna aasan ho jaayega
export const useAuth = () => {
  return useContext(AuthContext);
};

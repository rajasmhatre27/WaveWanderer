import React from "react";
import { Routes, Route } from "react-router-dom";

// 1. Apne saare pages ko import karo
import Home from "../pages/Home.jsx"; // Aapki Home.jsx file
import PlaceDetailPage from "../pages/PlaceDetailPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx"; // <-- Naya page import
import AdminPage from "../pages/AdminPage.jsx";

const AppRoutes = () => {
  return (
    // 2. 'Routes' component URLs ko manage karta hai
    <Routes>
      {/* Jab URL '/' ho, toh 'Home' component dikhao */}
      <Route path="/" element={<Home />} />

      {/* Jab URL '/places/1' (ya /places/2, etc.) ho, toh 'PlaceDetailPage' dikhao */}
      <Route path="/places/:id" element={<PlaceDetailPage />} />

      {/* Jab URL '/register' ho, toh 'RegisterPage' dikhao */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Jab URL '/login' ho, toh 'LoginPage' dikhao */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRoutes;

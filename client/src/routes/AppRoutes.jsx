import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home.jsx";
import PlaceDetailPage from "../pages/PlaceDetailPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";

import AdminPage from "../pages/AdminPage.jsx";
// 1. Import New Page
import TripPlannerPage from "../pages/TripPlannerPage.jsx";
import MapPage from "../pages/MapPage.jsx";
import AllPlaces from "../pages/AllPlaces.jsx";
import WeatherWidget from "../components/WeatherWidget.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/places/:id" element={<PlaceDetailPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/places" element={<AllPlaces />} />

      {/* 2. Add New Route */}
      <Route path="/trip-planner" element={<TripPlannerPage />} />
    </Routes>
  );
};

export default AppRoutes;

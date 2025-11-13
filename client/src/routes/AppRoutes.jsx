import React from "react";
// 1. Router ke tools import karo
import { Routes, Route } from "react-router-dom";

// 2. Apne saare pages yahaan import karo
import Home from "../pages/Home";
import PlaceDetailPage from "../pages/PlaceDetailPage";
// (Baad mein hum aur pages yahaan add karenge)
// import PlaceDetailPage from '../pages/PlaceDetailPage';
// import LoginPage from '../pages/LoginPage';

const AppRoutes = () => {
  return (
    // 3. Yahaan hum apne saare URL rules define karenge
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/places/:id" element={<PlaceDetailPage />} />

      {/* <Route path="/places/:id" element={<PlaceDetailPage />} />
        <Route path="/login" element={<LoginPage />} /> 
      */}
    </Routes>
  );
};

export default AppRoutes;

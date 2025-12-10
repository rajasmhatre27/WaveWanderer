import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./../context/AuthContext.jsx";
import { useTrip } from "./../context/TripContext.jsx";
// 1. Redux hook import karo Shop Cart ke liye
import { useSelector } from "react-redux";
import {
  MapPin,
  ShoppingBag,
  ShoppingCart, // Product Cart ke liye
  Briefcase, // Trip Planner ke liye naya icon
  User,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const { user, token, logout } = useAuth();

  // 2. Trip Context se Trip Count nikalo
  const { tripCount } = useTrip();

  // 3. Redux Store se Product Cart Count nikalo
  const cartItems = useSelector((state) => state.cart.items);
  const productCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserDropdownOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-b border-gray-100"
          : "bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-200/60"
      }`}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 p-2 rounded-full shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WaveWanderer
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`relative font-medium transition-all duration-300 group ${
                isActiveRoute("/")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
              {isActiveRoute("/") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>

            <Link
              to="/places"
              className={`relative font-medium transition-all duration-300 group ${
                isActiveRoute("/places")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Explore
              {isActiveRoute("/places") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>

            {/* Shop Link */}
            <Link
              to="/shop"
              className={`relative font-medium transition-all duration-300 group ${
                isActiveRoute("/shop")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Shop
              {isActiveRoute("/shop") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>
          </div>

          {/* Right Side: Carts & User Actions */}
          <div className="flex items-center space-x-6">
            {/* --- 1. TRIP PLANNER CART (Briefcase Icon) --- */}
            <Link
              to="/trip-planner"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group"
              title="Your Trip Itinerary"
            >
              <Briefcase className="w-6 h-6" />
              {tripCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                  {tripCount}
                </span>
              )}
            </Link>

            {/* --- 2. PRODUCT SHOP CART (ShoppingCart Icon) --- */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors group"
              title="Your Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {productCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                  {productCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login Buttons */}
            {token ? (
              <div className="flex items-center space-x-4">
                {/* Admin Link (Only for admins) */}
                {user && user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-2 py-1 md:px-4 md:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-inner">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 max-w-24 truncate hidden md:block">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                      <div className="px-4 py-3 border-b border-gray-200/60">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-200 group"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-gray-700 font-medium rounded-xl hover:bg-gray-100/80 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {/* (Mobile menu code can remain similar, just ensure cart icon logic is same) */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

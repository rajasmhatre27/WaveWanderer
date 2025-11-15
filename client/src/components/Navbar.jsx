import React from "react";
import { Link, useNavigate } from "react-router-dom";
// --- YEH HAI AAPKA FIX ---
// Humein 2 folder upar (../.. an) jaana hai 'src/' tak,
// phir 'context/' ke andar jaana hai.
import { useAuth } from "../context/AuthContext"; // <-- SAHI PATH

const Navbar = () => {
  // 1. Apne AuthContext se 'user', 'token', aur 'logout' function ko nikalo
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Context se logout function call karo
    navigate("/"); // User ko HomePage par bhej do
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800"
        >
          WaveWanderer
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/map" className="text-gray-600 hover:text-blue-600">
            Map
          </Link>

          {/* --- YEH HAI HAMAARA MAIN AUTH LOGIC --- */}

          {token ? (
            // 2. Agar token hai (user logged-in hai):
            <>
              {/* Check karo ki user 'admin' hai ya nahi */}
              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="font-semibold text-purple-600 hover:text-purple-800"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // 3. Agar token nahi hai (user logged-out hai):
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

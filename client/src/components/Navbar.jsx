import React from "react";
// 1. Humein 'Link' component chahiye 'react-router-dom' se
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    // Yeh Tailwind CSS classes hain jo isey ek accha look deti hain
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Website Title/Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-900"
        >
          Wave-Wanderer
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            About
          </Link>

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            Contact
          </Link>
          <Link
            to="/map"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            Map
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            <button>login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

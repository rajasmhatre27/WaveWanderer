import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700/50 mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
          {/* Column 1: Brand and Motto */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-full shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                WaveWanderer
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Navigate the world, one wave at a time.
            </p>
            <p className="text-xs text-gray-500 pt-2">
              Where your next journey begins.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="hover:text-blue-400 transition-colors"
                >
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link
                  to="/trip-planner"
                  className="hover:text-blue-400 transition-colors"
                >
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link
                  to="/places/trending"
                  className="hover:text-blue-400 transition-colors"
                >
                  Trending Places
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-400" />
                <a
                  href="mailto:support@wavewanderer.com"
                  className="hover:text-blue-400"
                >
                  support@wavewanderer.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-400" />
                <a href="tel:+1234567890" className="hover:text-blue-400">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-blue-400" />
                Worldwide Office
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Strip */}
        <div className="pt-8 flex justify-between items-center text-xs text-gray-500 flex-wrap">
          <p>
            &copy; {new Date().getFullYear()} WaveWanderer. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            {/* Placeholder for social media icons */}
            <span className="hover:text-white transition-colors cursor-pointer">
              Facebook
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Twitter
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Instagram
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCart from "../components/places/PlaceCart";
import { Link } from "react-router-dom";
import {
  MapPin,
  Utensils,
  Car,
  Search,
  Clock,
  Compass,
  PartyPopper,
  Bike,
  BookOpen,
  Waves,
  Castle,
  TreePine,
  Landmark,
  Sparkles,
} from "lucide-react";
import WeatherWidget from "../components/WeatherWidget";

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("https://wavewander-backend.onrender.com/places");
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  // Get unique categories from places
  const categories = [...new Set(places.map((place) => place.type))];

  // Count places per category
  const categoryCounts = categories.map((category) => ({
    name: category,
    count: places.filter((place) => place.type === category).length,
  }));

  // Icon mapping for categories
  const categoryIcons = {
    beach: Waves,
    fort: Castle,
    restaurant: Utensils,
    temple: Landmark,
    park: TreePine,
    historical: Landmark,
    // Add more mappings as needed
  };

  const getCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category] || Sparkles;
    return <IconComponent size={24} />;
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- 1. HERO SECTION --- */}
      <div className="relative h-[500px] w-full">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Alibag Beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Discover <span className="text-blue-400">Alibag</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl font-light mb-8 drop-shadow-md">
            Your ultimate local guide to hidden beaches, authentic food, and
            stress-free travel.
          </p>
          <div className="flex gap-4">
            <Link
              to="/map"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
            >
              <MapPin size={20} /> View Map
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. NEW: TRIP PLANNER DASHBOARD --- */}
      <div className="container mx-auto px-6 relative z-10 -mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-2xl border-l-8 border-blue-600 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-left">
            <div className="flex items-center text-blue-600 mb-2">
              <Clock className="w-6 h-6 mr-2" />
              <span className="font-bold uppercase tracking-wider text-sm">
                Smart Itinerary
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
              "I have 5 hours, what should I do?"
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Don't waste time planning. Choose your vibe, and we'll build a
              perfect schedule for you instantly. Add spots to your{" "}
              <strong>Trip Cart</strong> and go!
            </p>

            {/* Vibe Previews */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-pink-50 text-pink-700 px-4 py-2 rounded-full font-medium border border-pink-100">
                <PartyPopper size={18} className="mr-2" /> Family Fun
              </div>
              <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium border border-green-100">
                <Bike size={18} className="mr-2" /> Adventure
              </div>
              <div className="flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium border border-purple-100">
                <BookOpen size={18} className="mr-2" /> Relaxing
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <Link
            to="/trip-planner"
            className="flex-shrink-0 bg-gray-900 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition transform hover:-translate-y-1 flex items-center"
          >
            <Compass size={24} className="mr-3" />
            Open Trip Planner
          </Link>
        </div>
      </div>

      {/* --- 3. FEATURES SECTION --- */}
      <div className="container mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-yellow-500">
            <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-yellow-600">
              <Car size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Transport Solver
            </h3>
            <p className="text-gray-600">
              No more scams. Find fair auto fares and trusted scooter rentals
              instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-red-500">
            <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-red-600">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Authentic Food
            </h3>
            <p className="text-gray-600">
              Skip the tourist traps. Discover the best local Agari & Konkani
              seafood spots.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-green-600">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Hidden Gems
            </h3>
            <p className="text-gray-600">
              Find secret beaches and ancient forts that aren't on the usual
              maps.
            </p>
          </div>
        </div>
      </div>
      <WeatherWidget />

      {/* --- 4. NEW: CATEGORIES SECTION --- */}
      <div className="container mx-auto px-6 pb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Explore Categories
            </h2>
            <p className="text-gray-500 mt-2">
              Discover Alibag through different types of experiences
            </p>
          </div>
          <Link
            to="/places"
            className="text-blue-600 font-semibold hover:underline hidden md:block"
          >
            View All Places →
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-400">No categories found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categoryCounts.map((category) => (
              <Link
                key={category.name}
                to={`/places?category=${category.name}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 p-6 text-center group"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors duration-300 text-blue-600">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {formatCategoryName(category.name)}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count} {category.count === 1 ? "place" : "places"}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="text-center mt-8 md:hidden">
          <Link
            to="/places"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg inline-flex items-center gap-2"
          >
            View All Places
            <MapPin size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCart from "../components/places/PlaceCart";
import { Link } from "react-router-dom";
import { MapPin, Utensils, Car, Search } from "lucide-react"; // Importing icons (we will install this library)

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/places");
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

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
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Alibag Beach"
          className="w-full h-full object-cover"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Discover <span className="text-blue-400">Alibag</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl font-light mb-8 drop-shadow-md">
            Your ultimate local guide to hidden beaches, authentic food, and
            stress-free travel.
          </p>
          <Link
            to="/map"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
          >
            <MapPin size={20} /> Start Exploring
          </Link>
        </div>
      </div>

      {/* --- 2. FEATURES SECTION --- */}
      <div className="container mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Transport */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-yellow-500">
            <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-yellow-600">
              <Car size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Transport Solver
            </h3>
            <p className="text-gray-600 mb-4">
              No more scams. Find fair auto fares and trusted scooter rentals
              instantly.
            </p>
          </div>

          {/* Card 2: Food */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-red-500">
            <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-red-600">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Authentic Food
            </h3>
            <p className="text-gray-600 mb-4">
              Skip the tourist traps. Discover the best local Agari & Konkani
              seafood spots.
            </p>
          </div>

          {/* Card 3: Hidden Gems */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-green-600">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Hidden Gems
            </h3>
            <p className="text-gray-600 mb-4">
              Find secret beaches and ancient forts that aren't on the usual
              maps.
            </p>
          </div>
        </div>
      </div>

      {/* --- 3. POPULAR PLACES GRID --- */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Popular Destinations
            </h2>
            <p className="text-gray-500 mt-2">
              Top-rated spots loved by travelers and locals.
            </p>
          </div>
          <Link
            to="/map"
            className="text-blue-600 font-semibold hover:underline hidden md:block"
          >
            View on Map →
          </Link>
        </div>

        {places.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-400">No places found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCart key={place.place_id} place={place} />
            ))}
          </div>
        )}
      </div>

      {/* --- 4. CALL TO ACTION BANNER --- */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to experience the real Alibag?
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Join our community to save your favorite spots, write reviews, and
            get exclusive local tips.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition"
          >
            Join Now - It's Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

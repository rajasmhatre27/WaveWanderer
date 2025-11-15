import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCart from "../components/places/PlaceCart";
import { Link } from "react-router-dom"; // Link import karo buttons ke liye

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Logic (Ismein koi change nahi) ---
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

  // --- Loading State (Ismein koi change nahi) ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold">Loading places...</h1>
      </div>
    );
  }

  // --- YEH HAI NAYA, BEHTAR HOMEPAGE LAYOUT ---
  return (
    <div className="w-full">
      {/* 1. HERO SECTION (Welcome Block) */}
      <div
        className="relative bg-cover bg-center h-96"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/003366/FFFFFF?text=Beautiful+Alibag+Beach')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to WaveWanderer
          </h1>
          <p className="text-xl text-gray-200">
            Your local guide to Alibag's hidden gems.
          </p>
        </div>
      </div>

      {/* 2. FEATURES SECTION (Practical Approach) */}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center my-8">
          Aapki Madad Ke Liye Taiyaar (Here to Help)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Feature 1: Transport */}
          <div className="border p-6 rounded-lg shadow-lg bg-white">
            <span className="text-4xl">🛵</span>
            <h3 className="text-xl font-semibold my-2">Transport Solver</h3>
            <p className="text-gray-600 mb-4">
              Find fair auto fares and trusted scooter rentals.
            </p>
            <Link
              to="/transport-guide"
              className="text-blue-600 font-bold hover:underline"
            >
              Learn More
            </Link>
          </div>

          {/* Feature 2: Food */}
          <div className="border p-6 rounded-lg shadow-lg bg-white">
            <span className="text-4xl">🍲</span>
            <h3 className="text-xl font-semibold my-2">
              Authentic Food Finder
            </h3>
            <p className="text-gray-600 mb-4">
              Find real Agari seafood, not tourist traps.
            </p>
            <Link
              to="/food-guide"
              className="text-blue-600 font-bold hover:underline"
            >
              Learn More
            </Link>
          </div>

          {/* Feature 3: Map */}
          <div className="border p-6 rounded-lg shadow-lg bg-white">
            <span className="text-4xl">🗺️</span>
            <h3 className="text-xl font-semibold my-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              See all hidden gems on our live map.
            </p>
            <Link to="/map" className="text-blue-600 font-bold hover:underline">
              View Map
            </Link>
          </div>
        </div>
      </div>

      {/* 3. POPULAR PLACES SECTION (Yeh aapka purana grid hai) */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Explore Popular Spots 🌴
          </h2>
          {places.length === 0 ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600">
                No places found 😕
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCart key={place.place_id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

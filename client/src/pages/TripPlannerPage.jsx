import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import {
  LucideCompass,
  LucideMapPin,
  LucideClock,
  LucidePartyPopper,
  LucideBike,
  LucideBookOpen,
  LucideShoppingCart,
  LucidePlus,
  LucideMinus,
  LucideTrash2,
  Loader2,
} from "lucide-react";
import { useTrip } from "../context/TripContext";
import apiUrl from "../apiConfig";
// --- HELPER: Map DB Types to Planner Categories ---
// Database mein 'type' alag hai, aur Planner mein 'category' alag hai.
// Hum unhe yahaan connect kar rahe hain.
const getCategoryFromType = (type) => {
  const t = type.toLowerCase();
  if (t === "beach" || t === "hidden gem") return "Nature";
  if (t === "fort") return "History";
  if (t === "restaurant" || t === "hotel") return "Food";
  return "Adventure";
};

const CATEGORIES = [
  { name: "All", icon: LucideMapPin },
  { name: "Nature", icon: LucideBike },
  { name: "History", icon: LucideBookOpen },
  { name: "Food", icon: LucidePartyPopper },
];

// --- COMPONENT STARTS HERE ---
const TripPlannerPage = () => {
  // 1. State for Backend Data
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. State for Filter & Cart
  const [filterCategory, setFilterCategory] = useState("All");
  const { tripItems, addToTrip, removeFromTrip } = useTrip();
  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/places`);
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  // --- SAVE CART TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem("my_trip_cart", JSON.stringify(tripItems));
  }, [tripItems]);

  // --- FILTER LOGIC ---
  const filteredPlaces = useMemo(() => {
    if (filterCategory === "All") return places;
    return places.filter(
      (place) => getCategoryFromType(place.type) === filterCategory
    );
  }, [places, filterCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* --- LEFT SIDE: EXPLORE & FILTER --- */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <LucideCompass className="mr-3 text-blue-600" /> Explore & Plan
        </h1>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilterCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all
                ${
                  filterCategory === cat.name
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 border hover:bg-gray-100"
                }`}
            >
              <cat.icon className="w-4 h-4 mr-2" /> {cat.name}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlaces.map((place) => {
            const isAdded = tripItems.find(
              (item) => item.place_id === place.place_id
            );

            return (
              <div
                key={place.place_id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{place.name}</h3>
                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {place.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {place.description}
                  </p>

                  <button
                    onClick={() =>
                      isAdded
                        ? removeFromTrip(place.place_id)
                        : addToTrip(place)
                    }
                    className={`mt-4 w-full py-2 rounded-lg font-semibold flex items-center justify-center transition-colors
                      ${
                        isAdded
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                  >
                    {isAdded ? (
                      <>
                        <LucideMinus className="w-4 h-4 mr-2" /> Remove
                      </>
                    ) : (
                      <>
                        <LucidePlus className="w-4 h-4 mr-2" /> Add to Trip
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- RIGHT SIDE: TRIP CART (Sticky Sidebar) --- */}
      <div className="w-full md:w-96 bg-white border-l border-gray-200 p-6 shadow-2xl h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
          <LucideShoppingCart className="mr-3 text-green-600" /> Your Trip
        </h2>

        {tripItems.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <LucideMapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Your trip is empty.</p>
            <p className="text-sm">Add places from the list!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-bold">
                Total Stops: {tripItems.length}
              </p>
              <p className="text-xs text-green-600">
                Estimated Time: ~{tripItems.length * 1.5} hours
              </p>
            </div>

            {tripItems.map((item, index) => (
              <div
                key={item.place_id}
                className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 relative group"
              >
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
                <button
                  onClick={() => removeFromTrip(item.place_id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <LucideTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center">
              Save Itinerary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlannerPage;

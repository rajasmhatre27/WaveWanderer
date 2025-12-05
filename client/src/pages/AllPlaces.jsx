import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import PlaceCart from "../components/places/PlaceCart"; // Ensure path is correct
import {
  Loader2,
  Sun,
  Castle,
  Utensils,
  Bike,
  BookOpen,
  PartyPopper,
  MapPin,
} from "lucide-react";
import apiUrl from "../apiConfig"; // Your API URL config

// Categories Configuration
const CATEGORIES = [
  { name: "All", slug: "", icon: MapPin, color: "bg-gray-100 text-gray-700" },
  {
    name: "Beaches",
    slug: "beach",
    icon: Sun,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Forts",
    slug: "fort",
    icon: Castle,
    color: "bg-stone-200 text-stone-700",
  },
  {
    name: "Food",
    slug: "restaurant",
    icon: Utensils,
    color: "bg-red-100 text-red-600",
  }, // slug matches DB 'type'
  {
    name: "Adventure",
    slug: "adventure",
    icon: Bike,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Relaxing",
    slug: "relax",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-600",
  },
];

const AllPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL se category padhna (e.g., /places?category=beach)
  const currentCategory = searchParams.get("category") || "";

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        // Ensure apiUrl is correctly defined in apiConfig.js
        // It should not have a trailing slash if the path starts with /
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

  // Filter Logic
  const filteredPlaces = currentCategory
    ? places.filter(
        (place) =>
          place.type &&
          place.type.toLowerCase() === currentCategory.toLowerCase()
      )
    : places;

  // Handle Category Click
  const handleCategoryClick = (slug) => {
    setSearchParams(slug ? { category: slug } : {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Alibag</h1>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentCategory === cat.slug
                ? "bg-blue-600 text-white shadow-md transform scale-105"
                : `${cat.color} hover:opacity-80`
            }`}
          >
            <cat.icon className="w-4 h-4 mr-2" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Places Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => (
            <PlaceCart key={place.place_id} place={place} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-xl text-gray-500">
            No places found for this category.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 text-blue-600 hover:underline font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllPlaces;

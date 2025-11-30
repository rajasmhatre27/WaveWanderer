import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import PlaceCart from "../components/places/PlaceCart";
import { Search, MapPin, Filter, X } from "lucide-react";

const AllPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL parameters
  const urlCategory = searchParams.get("category");

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

  // Set filter type if category is present in URL
  useEffect(() => {
    if (urlCategory) {
      setFilterType(urlCategory);
    }
  }, [urlCategory]);

  // Filter places based on search and type
  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || place.type === filterType;

    return matchesSearch && matchesType;
  });

  // Get unique types for filter dropdown
  const placeTypes = [...new Set(places.map((place) => place.type))];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setSearchParams({}); // Clear URL parameters
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: type });
    }
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
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {urlCategory
                  ? `${formatCategoryName(urlCategory)} in Alibag`
                  : "All Places in Alibag"}
              </h1>
              <p className="text-gray-600 text-lg">
                {urlCategory
                  ? `Discover ${filteredPlaces.length} ${formatCategoryName(
                      urlCategory
                    ).toLowerCase()} places`
                  : `Discover ${places.length} amazing destinations, beaches, restaurants, and more`}
              </p>
            </div>
            <Link
              to="/map"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition hover:scale-105 flex items-center gap-2"
            >
              <MapPin size={20} /> View on Map
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search places by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-2 items-center">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {placeTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatCategoryName(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || filterType !== "all") && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={18} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredPlaces.length} of {places.length} places
            {searchTerm && (
              <span>
                {" "}
                for "<strong>{searchTerm}</strong>"
              </span>
            )}
            {filterType !== "all" && (
              <span>
                {" "}
                in <strong>{formatCategoryName(filterType)}</strong>
              </span>
            )}
          </p>

          {/* Sort Options */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Sort by: Popular</option>
            <option>Sort by: Name</option>
            <option>Sort by: Location</option>
          </select>
        </div>
      </div>

      {/* Places Grid */}
      <div className="container mx-auto px-6 pb-16">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No places found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No places available at the moment"}
              </p>
              {(searchTerm || filterType !== "all") && (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCart key={place.place_id} place={place} />
            ))}
          </div>
        )}
      </div>

      {/* Back to Home */}
      <div className="container mx-auto px-6 pb-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

// Helper function to format category names
const formatCategoryName = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default AllPlaces;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import apiUrl from "../apiConfig";
// --- Leaflet Icon Fix ---
// This fixes the issue where default markers don't show up in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- End Fix ---

const MapPage = () => {
  // 1. State to hold places from the backend
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data from Backend API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // Calling our Express API
        const response = await axios.get(`${apiUrl}/api/places`);

        // Filter out places that don't have valid coordinates (to prevent map errors)
        const validPlaces = response.data.filter(
          (place) =>
            place.latitude &&
            place.longitude &&
            !isNaN(parseFloat(place.latitude)) &&
            !isNaN(parseFloat(place.longitude))
        );

        setPlaces(validPlaces);
      } catch (err) {
        console.error("Error fetching places for map:", err);
        setError("Failed to load map locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  // Center the map on Alibag
  const alibagCenter = [18.6416, 72.8793];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6 text-gray-800">
        Explore Alibag on the Map
      </h1>

      <div className="h-[75vh] w-full border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-0 relative">
        <MapContainer
          center={alibagCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          {/* OpenStreetMap Tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* 3. Render Markers from Backend Data */}
          {places.map((place) => (
            <Marker
              key={place.place_id}
              position={[
                parseFloat(place.latitude),
                parseFloat(place.longitude),
              ]}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-sm mb-1">{place.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {place.type}
                  </span>
                  {place.image_url && (
                    <img
                      src={place.image_url}
                      alt={place.name}
                      className="w-full h-24 object-cover rounded-md mt-2 mb-2"
                      onError={(e) => (e.target.style.display = "none")} // Hide broken images
                    />
                  )}
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {place.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="text-center text-gray-500 mt-4 text-sm">
        Showing {places.length} locations fetched from your database.
      </p>
    </div>
  );
};

export default MapPage;

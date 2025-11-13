import React from "react";
import { Link } from "react-router-dom";

// 'place' is received as a prop
const PlaceCart = ({ place }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/places/${place.place_id}`}>
        <img
          src={place.image_url || "/placeholder.jpg"}
          alt={place.name || "Place"}
          className="w-full h-48 object-cover"
        />

        <div className="p-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
            {place.type || "Unknown Type"}
          </span>

          <h3 className="font-bold text-xl mb-2">
            {place.name || "Unnamed Place"}
          </h3>

          {/* Optional: rating or description */}
          {place.rating && (
            <p className="text-yellow-500 text-sm">⭐ {place.rating}</p>
          )}
          {place.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {place.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PlaceCart;

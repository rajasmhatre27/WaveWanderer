import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

const PlaceCart = ({ place }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <Link
        to={`/places/${place.place_id}`}
        className="relative block overflow-hidden h-56"
      >
        <img
          src={place.image_url || "https://via.placeholder.com/400x300"}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
          {place.type}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {place.name}
          </h3>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1 text-blue-500" />
          <span className="line-clamp-1">{place.location}</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
          {place.description}
        </p>

        <Link
          to={`/places/${place.place_id}`}
          className="mt-auto w-full text-center py-2.5 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PlaceCart;

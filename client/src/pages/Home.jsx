import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCart from "../components/places/PlaceCart";

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
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold">Loading places...</h1>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          No places found 😕
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-6 mb-4">
        Explore Popular Places 🌴
      </h1>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {places.map((place) => {
          return <PlaceCart key={place.place_id} place={place} />;
        })}
      </div>
    </div>
  );
};

export default Home;

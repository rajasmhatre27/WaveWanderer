import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PlaceDetailPage = () => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Yeh URL se 'id' (jaise "1") nikalega

  useEffect(() => {
    // Yeh hamara data fetching function hai
    const fetchPlaceDetails = async () => {
      try {
        // Humne API ko 'id' ke saath call kiya
        const response = await axios.get(
          `http://localhost:5000/api/places/${id}`
        );
        // Data ko 'place' state mein save kiya
        setPlace(response.data);
      } catch (error) {
        console.error("Error fetching place details:", error.message);
      } finally {
        // Data aa gaya ho ya error, 'loading' ko 'false' kar do
        setLoading(false);
      }
    };

    // Is function ko call karo
    fetchPlaceDetails();
  }, [id]); // Dependency array mein [id] daala hai
  // Iska matlab: agar URL mein ID badlega, toh yeh function dobara chalega

  // --- Loading aur Error States ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold">Loading details...</h1>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold">Sorry, place not found.</h1>
      </div>
    );
  }

  // --- Jab Data Aa Jaaye (Success State) ---

  return (
    <div className="container mx-auto p-4">
      {/* Hum Tailwind CSS ka istemaal karke layout bana rahe hain */}
      <div className="max-w-4xl mx-auto">
        {/* Place ka Naam */}
        <h1 className="text-4xl font-bold mb-4">{place.name}</h1>

        {/* Place ki Image */}
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
        />

        {/* Place ka Type/Location */}
        <div className="flex justify-between items-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-md font-semibold">
            {place.type}
          </span>
          <span className="text-gray-600 font-semibold">
            📍 {place.location}
          </span>
        </div>

        {/* Place ka Description */}
        <p className="text-lg text-gray-700 mb-8">{place.description}</p>

        {/* Reviews ka Section */}
        <hr className="mb-6" />
        <h3 className="text-2xl font-bold mb-4">
          Reviews ({place.reviews.length})
        </h3>

        <div className="space-y-4">
          {/* Hum 'place.reviews' array (jo server se aaya hai) par loop kar rahe hain */}
          {place.reviews.length > 0 ? (
            place.reviews.map((review) => (
              <div
                key={review.review_id}
                className="border p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 font-bold text-lg">
                    {"⭐".repeat(review.rating)}
                  </span>
                  {/* Hum yahaan baad mein user ka naam dikha sakte hain */}
                  {/* <span className="ml-3 text-gray-600 font-semibold">by User {review.user_id}</span> */}
                </div>
                <p className="text-gray-800">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews for this place yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;

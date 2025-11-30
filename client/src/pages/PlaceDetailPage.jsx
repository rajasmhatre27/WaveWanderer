import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Link import karna zaroori hai
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Map components
import "leaflet/dist/leaflet.css"; // CSS import
import L from "leaflet";

// --- Leaflet Icon Fix ---
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

const PlaceDetailPage = () => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review State
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");

  const { id: placeId } = useParams();
  const { token } = useAuth();

  // Data Fetching
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/places/${placeId}`
        );
        setPlace(response.data);
      } catch (error) {
        console.error("Error fetching place details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  // Review Submission Logic
  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          place_id: placeId,
          rating: parseInt(newReview.rating),
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlace({
        ...place,
        reviews: [...place.reviews, response.data],
      });

      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error posting review:", error.response.data);
      setReviewError(error.response.data.message || "Failed to post review.");
    }
  };

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

  // Check if this place has valid coordinates for the map
  const hasCoordinates = place.latitude && place.longitude;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-bold mb-4">{place.name}</h1>
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
          onError={(e) => (e.target.style.display = "none")}
        />

        <div className="flex justify-between items-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-md font-semibold">
            {place.type}
          </span>
          <span className="text-gray-600 font-semibold">
            📍 {place.location}
          </span>
        </div>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {place.description}
        </p>

        {/* --- NEW: MINI MAP SECTION --- */}
        {hasCoordinates && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4">Location on Map</h3>
            <div className="h-64 w-full border-2 border-gray-200 rounded-xl overflow-hidden shadow-md z-0 relative">
              <MapContainer
                center={[
                  parseFloat(place.latitude),
                  parseFloat(place.longitude),
                ]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                dragging={false} // Map ko "static" feel dene ke liye (optional)
                scrollWheelZoom={false} // Page scroll karte waqt map zoom na ho
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker
                  position={[
                    parseFloat(place.latitude),
                    parseFloat(place.longitude),
                  ]}
                >
                  <Popup>{place.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        <hr className="mb-6 border-gray-300" />

        {/* Review Form */}
        {token ? (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
            {reviewError && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md mb-4">
                {reviewError}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rating
              </label>
              <select
                name="rating"
                id="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (Great)</option>
                <option value="3">⭐⭐⭐ (Good)</option>
                <option value="2">⭐⭐ (Okay)</option>
                <option value="1">⭐ (Bad)</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comment
              </label>
              <textarea
                name="comment"
                id="comment"
                rows="3"
                value={newReview.comment}
                onChange={handleReviewChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Share your experience..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg mb-8 border border-gray-200">
            <p className="font-semibold text-gray-700">
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-bold"
              >
                Log in
              </Link>{" "}
              to write a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        <h3 className="text-2xl font-bold mb-4">
          Reviews ({place.reviews.length})
        </h3>
        <div className="space-y-4">
          {place.reviews.length > 0 ? (
            place.reviews.map((review) => (
              <div
                key={review.review_id}
                className="bg-white border p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-lg tracking-wider">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Posted on {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No reviews for this place yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;

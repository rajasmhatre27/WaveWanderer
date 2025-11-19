import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // <-- NAYA IMPORT (user ko check karne ke liye)

const PlaceDetailPage = () => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- NAYA STATE (Review form ke liye) ---
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");

  const { id: placeId } = useParams(); // 'id' ka naam 'placeId' rakha (zyada clear hai)
  const { token } = useAuth(); // <-- NAYA: Check karo ki user logged-in hai ya nahi

  // --- Data Fetching (Ismein koi change nahi) ---
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
  }, [placeId]); // 'id' ko 'placeId' se replace kiya

  // --- NAYA FUNCTION (Review Submit Karne Ke Liye) ---
  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    try {
      // 1. Backend ko call karo (Token ke saath)
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          place_id: placeId,
          rating: parseInt(newReview.rating), // String ko number mein badlo
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // <-- YEH HAI LOGIN PROOF
          },
        }
      );

      // 2. Success! Naye review ko state mein add karo (taaki page turant update ho)
      setPlace({
        ...place,
        reviews: [...place.reviews, response.data], // Purane reviews + naya review
      });

      // Form ko reset karo
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error posting review:", error.response.data);
      setReviewError(error.response.data.message || "Failed to post review.");
    }
  };

  // --- Loading aur Error States (Ismein koi change nahi) ---
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
      <div className="max-w-4xl mx-auto">
        {/* Place details (Pehle jaisa) */}
        <h1 className="text-4xl font-bold mb-4">{place.name}</h1>
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
        />
        <div className="flex justify-between items-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-md font-semibold">
            {place.type}
          </span>
          <span className="text-gray-600 font-semibold">
            📍 {place.location}
          </span>
        </div>
        <p className="text-lg text-gray-700 mb-8">{place.description}</p>

        <hr className="mb-6" />

        {/* --- NAYA "ADD REVIEW" FORM --- */}
        {/* Yeh form sirf tab dikhega jab user logged-in hai (token != null) */}
        {token ? (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
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
                className="block text-sm font-medium text-gray-700"
              >
                Rating
              </label>
              <select
                name="rating"
                id="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Great)</option>
                <option value="3">3 Stars (Good)</option>
                <option value="2">2 Stars (Okay)</option>
                <option value="1">1 Star (Bad)</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Comment
              </label>
              <textarea
                name="comment"
                id="comment"
                rows="4"
                value={newReview.comment}
                onChange={handleReviewChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Share your experience..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        ) : (
          // Agar user logged-in nahi hai, toh yeh message dikhao
          <div className="text-center p-6 bg-gray-100 rounded-lg mb-8">
            <p className="font-semibold text-gray-700">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{" "}
              to write a review.
            </p>
          </div>
        )}

        {/* --- Reviews ka Section (Pehle jaisa) --- */}
        <h3 className="text-2xl font-bold mb-4">
          Reviews ({place.reviews.length})
        </h3>
        <div className="space-y-4">
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

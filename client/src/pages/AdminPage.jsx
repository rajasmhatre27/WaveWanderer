import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    type: "Beach",
    latitude: "",
    longitude: "",
  });

  // Toggle: Upload vs URL
  const [useUrl, setUseUrl] = useState(true); // Default 'true' rakha hai taaki aasan ho
  const [imageUrlInput, setImageUrlInput] = useState(""); // URL ke liye
  const [imageFile, setImageFile] = useState(null); // File ke liye

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useAuth();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      let finalImageUrl = "";

      if (useUrl) {
        // OPTION 1: Agar user ne URL select kiya hai
        if (!imageUrlInput) {
          throw new Error("Please enter an image URL.");
        }
        finalImageUrl = imageUrlInput;
      } else {
        // OPTION 2: Agar user ne Upload select kiya hai
        if (!imageFile) {
          throw new Error("Please select an image file.");
        }

        const imageData = new FormData();
        imageData.append("image", imageFile);

        console.log("Uploading image...");
        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          imageData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        finalImageUrl = uploadResponse.data.url;
      }

      // Step 2: Place ka data save karo
      const placeData = { ...formData, image_url: finalImageUrl };

      await axios.post("http://localhost:5000/api/places", placeData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(`Place "${formData.name}" added successfully!`);

      // Reset form
      setFormData({
        name: "",
        description: "",
        location: "",
        type: "Beach",
        latitude: "",
        longitude: "",
      });
      setImageUrlInput("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to add place."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center my-6">Admin Dashboard</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold">Add New Place</h2>

        {/* Name, Description, Location fields... */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            className="w-full px-3 py-2 mt-1 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            className="w-full px-3 py-2 mt-1 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            required
            className="w-full px-3 py-2 mt-1 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={onChange}
            className="w-full px-3 py-2 mt-1 border rounded-md"
          >
            <option value="Beach">Beach</option>
            <option value="Fort">Fort</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Hotel">Hotel</option>
            <option value="Hidden Gem">Hidden Gem</option>
          </select>
        </div>

        {/* --- IMAGE SECTION (SWITCH) --- */}
        <div className="border p-4 rounded-md bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Source:
          </label>
          <div className="flex gap-4 mb-3">
            <button
              type="button"
              onClick={() => setUseUrl(true)}
              className={`px-3 py-1 rounded-md text-sm ${
                useUrl ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Paste URL
            </button>
            <button
              type="button"
              onClick={() => setUseUrl(false)}
              className={`px-3 py-1 rounded-md text-sm ${
                !useUrl ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Upload File
            </button>
          </div>

          {useUrl ? (
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full mt-1"
            />
          )}
          <p className="text-xs text-gray-500 mt-1">
            {useUrl
              ? "Copy image address from Google/Unsplash."
              : "Max size 1MB."}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude}
              onChange={onChange}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude}
              onChange={onChange}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 font-semibold p-3 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 font-semibold p-3 bg-green-100 rounded-md">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`w-full px-4 py-2 text-lg font-medium text-white rounded-md ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Processing..." : "Add Place"}
        </button>
      </form>
    </div>
  );
};

export default AdminPage;

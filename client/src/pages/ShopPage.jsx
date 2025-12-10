import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // Redux action
import { ShoppingBag, Plus, Star, Search, Filter } from "lucide-react";
import apiUrl from "../apiConfig";

// Fallback Mock Data (Agar backend abhi ready na ho)
const MOCK_PRODUCTS = [
  {
    product_id: 101,
    name: "Authentic Alibag Spices",
    price: 250,
    image_url: "https://m.media-amazon.com/images/I/71K2M7-E7RL.jpg",
    description: "Hand-ground spices for the perfect fish curry.",
    category: "Spices",
  },
  {
    product_id: 102,
    name: "Premium Konkan Cashews",
    price: 450,
    image_url: "https://placehold.co/400x400/FFA500/ffffff?text=Cashews",
    description: "Freshly roasted salted cashews.",
    category: "Snacks",
  },
  {
    product_id: 103,
    name: "Wooden Handicraft Toy",
    price: 150,
    image_url: "https://placehold.co/400x400/8B4513/ffffff?text=Wooden+Toy",
    description: "Traditional handmade toy by local artisans.",
    category: "Art",
  },
  {
    product_id: 104,
    name: "Kokum Sherbet Mix",
    price: 180,
    image_url: "https://placehold.co/400x400/DC143C/ffffff?text=Kokum",
    description: "Refreshing summer drink concentrate.",
    category: "Beverages",
  },
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/shop/products`);
        if (response.data.length > 0) {
          setProducts(response.data);
        } else {
          setProducts(MOCK_PRODUCTS); // Fallback to mock data
        }
      } catch (error) {
        console.error("Error fetching products, using mock data:", error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    // Optional: Add a toast notification here
  };

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            WaveWanderer Shop
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Support local artisans and farmers. Bring home the authentic taste
            and culture of Alibag.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8">
        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {["All", "Spices", "Snacks", "Art", "Beverages"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
                  {product.category || "Local"}
                </div>
              </div>

              <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xl font-bold text-blue-900">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-blue-200 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

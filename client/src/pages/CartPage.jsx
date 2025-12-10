import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import apiUrl from "../apiConfig";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { token } = useAuth(); // Auth token chahiye payment ke liye
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 50;
  const total = subtotal + shipping;

  // --- CHECKOUT HANDLER ---
  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to checkout!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // 1. Backend ko cart items bhejo
      const response = await axios.post(
        `${apiUrl}/api/shop/checkout`,
        { cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Backend humein Stripe ka URL dega
      if (response.data.url) {
        // 3. User ko Stripe ke page par redirect karo
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Checkout failed. Please try again.");
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any souvenirs yet.
          </p>
          <Link
            to="/shop"
            className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
          <ShoppingBag className="mr-3 text-blue-600" /> Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-50 last:border-0"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-blue-600 font-bold mt-1">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product_id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-200 rounded-l-lg disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-10 text-center font-medium text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product_id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-2 hover:bg-gray-200 rounded-r-lg"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.product_id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-red-600 text-sm font-semibold hover:underline"
                >
                  Clear Cart
                </button>
                <Link
                  to="/shop"
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Checkout Now <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

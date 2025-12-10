import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle, AlertTriangle } from "lucide-react";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason"); // Backend se agar reason bheja jaye toh use read karein

  // Optional: Aap analytics ya logs ke liye failure ko track kar sakte hain
  useEffect(() => {
    if (reason) {
      console.warn("Payment was cancelled or failed due to:", reason);
    }
  }, [reason]);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
        <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          {reason === "error" ? (
            <AlertTriangle className="w-12 h-12 text-red-600" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {reason === "error" ? "Payment Failed" : "Payment Cancelled"}
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {reason === "error"
            ? "Something went wrong during the transaction. Don't worry, you haven't been charged."
            : "You have cancelled the payment process. You have not been charged."}
        </p>

        <div className="space-y-3">
          <Link
            to="/cart"
            className="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Return to Cart & Try Again
          </Link>

          <Link
            to="/shop"
            className="block w-full bg-white text-gray-600 font-semibold py-3 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:text-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          If this issue persists, please contact support@wavewanderer.com
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;

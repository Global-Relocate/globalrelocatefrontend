import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-700 mb-8">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

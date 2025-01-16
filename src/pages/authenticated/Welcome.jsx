import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.username || "User";

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-medium mb-4">
          Welcome on board {userName}!
        </h1>
        <p className="text-base text-gray-700 mb-20">
          Your AI-powered platform for seamless relocation, legal guidance, and global living.
        </p>
        <button
          onClick={handleContinue}
          className="w-full max-w-md mx-auto py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

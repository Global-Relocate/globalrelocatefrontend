import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCheckoutRedirect } from "@/hooks/useCheckoutRedirect";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useCheckoutRedirect();

  if (location.pathname.includes("checkout")) {
    return null;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="bg-[#FCA311] text-white py-2 px-6 rounded-lg text-lg font-medium"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;

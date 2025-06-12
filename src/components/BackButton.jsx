import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate(-1), 300);
  };

  return (
    <motion.button
      onClick={handleBack}
      className="fixed top-16 left-4 z-50 bg-gray-800 text-white p-4 rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-blue-600 hover:scale-105 transition-all duration-300"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <FaArrowLeft className="text-white group-hover:text-white transition duration-300 text-xl" />
    </motion.button>
  );
};

export default BackButton;

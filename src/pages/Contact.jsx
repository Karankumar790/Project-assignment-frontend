import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import BackButton from "@/components/BackButton";
import { useQueriesMutation } from "@/features/api/authApi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [queriesMutation, { isLoading }] = useQueriesMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await queriesMutation(formData).unwrap();
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-20 px-4">
      {/* Header / Intro */}
      <motion.div
        className="max-w-3xl mx-auto mb-10 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md my-2"
        >
          Let’s Talk 👋
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have a question, suggestion, or just want to say hi? Fill out the form
          below and we’ll get back to you as soon as possible.
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-gray-400" />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10 w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <div className="relative">
              <FaCommentDots className="absolute top-4 left-3 text-gray-400" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="pl-10 w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>
      <BackButton />
    </div>
  );
};

export default Contact;

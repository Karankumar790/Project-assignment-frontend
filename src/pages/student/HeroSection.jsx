import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { FaCode, FaDatabase, FaPaintBrush, FaRobot } from "react-icons/fa";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  // const topics = [
  //   { title: "Web Development", icon: <FaCode />, query: "web development" },
  //   { title: "Data Science", icon: <FaDatabase />, query: "data science" },
  //   { title: "UI/UX Design", icon: <FaPaintBrush />, query: "ui ux" },
  //   { title: "AI & ML", icon: <FaRobot />, query: "machine learning" },
  // ];

  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-purple-500 to-pink-500  dark:from-gray-900 dark:to-gray-800 py-32 px-4 md:px-8 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        {/* <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
        >
          Discover. Learn. Transform.
        </motion.h1> */}

        {/* <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-200 dark:text-gray-400 mb-10"
        >
          Dive into high-quality courses that take your skills to the next level.
        </motion.p> */}

        {/* Topic Cards */}
        {/* <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {topics.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/course/search?query=${item.query}`)}
              className="bg-white dark:bg-gray-800 text-blue-700 dark:text-white font-semibold rounded-lg py-5 px-4 flex flex-col items-center gap-3 hover:bg-blue-100 dark:hover:bg-gray-700 shadow-md transition-all duration-300"
            >
              <div className="text-3xl">{item.icon}</div>
              <span className="text-sm">{item.title}</span>
            </motion.button>
          ))}
        </motion.div> */}

        {/* Search Form */}
        <motion.form
          onSubmit={searchHandler}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-900 rounded-full shadow-lg overflow-hidden max-w-2xl mx-auto mb-6"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses..."
            className="w-full border-none px-6 py-4 text-gray-800 dark:text-white placeholder-gray-500 bg-transparent focus-visible:ring-0"
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-4 rounded-none sm:rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
          >
            Search
          </Button>
        </motion.form>

        {/* Explore All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button
            onClick={() => navigate(`/course/search?query=`)}
            className="mt-4 bg-white dark:bg-gray-800 text-blue-700 font-bold px-6 py-3 rounded-full hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            🎯 Explore All Courses
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

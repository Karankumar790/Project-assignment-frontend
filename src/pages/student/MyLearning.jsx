import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import BackButton from "@/components/BackButton";
import { motion } from "framer-motion";


const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user.enrolledCourses || [];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-4xl w-full my-10 px-4 md:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md "
      >
        My Learning
      </motion.h1>

        <div className="my-5 ">
          {isLoading ? (
            <MyLearningSkeleton />
          ) : myLearning.length === 0 ? (
            <p>You are not enrolled in any course.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myLearning.map((course, index) => (
                <Course key={index} course={course} />
              ))}
            </div>
          )}
        </div>
        <BackButton/>
      </main>
    </div>
  );
};

export default MyLearning;

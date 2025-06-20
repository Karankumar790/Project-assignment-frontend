import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import BackButton from "@/components/BackButton";
// posted by the user
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetUserPostsQuery } from "@/features/api/authApi";
import PostCard from "@/components/PostCard";

const Courses = () => {
  const navigate = useNavigate();
  const {
    data: userPostsData,
    isLoading: isUserPostsLoading,
    isError: isUserPostsError,
  } = useGetUserPostsQuery();
  const { data, isLoading, isError, error } = useGetPublishedCourseQuery();

  console.log("User Posts Data:", userPostsData);

  const posts =
    userPostsData?.posts ??
    userPostsData?.data ??
    userPostsData?.allPosts ??
    (Array.isArray(userPostsData) ? userPostsData : []);

  if (isError) {
    console.error("Error fetching courses:", error);
    return <h1>Some error occurred while fetching courses.</h1>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen  px-4">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses &&
              data.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* {isUserPostsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : posts.length > 0 ? (
            posts.map((post, index) => <PostCard key={index} post={post} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No posts found.
            </p>
          )} */}

          {isUserPostsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : userPostsData?.data?.length > 0 ? (
            userPostsData.data.map((post, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No posts found.
            </p>
          )}
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

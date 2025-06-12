import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import BuyCourseButton from "@/components/BuyCourseButton";
import BackButton from "@/components/BackButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReactPlayer from "react-player";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, PlayCircle } from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) {
    return (
      <h1 className="text-center mt-10 text-xl animate-pulse text-muted-foreground">
        <LoadingSpinner />
      </h1>
    );
  }

  if (isError || !data || !data.course) {
    return <h1 className="text-center text-red-500">Failed to load course details</h1>;
  }

  const { course, purchased } = data;
  const totalLectures = course.lectures.length;

  const handleContinueCourse = () => {
    if (purchased) navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="space-y-12 font-poppins mb-20 text-gray-800 dark:text-gray-100 transition-colors">
      <BackButton />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 dark:from-indigo-900 dark:to-purple-800 py-16 px-4 md:px-8 text-white shadow-xl rounded-b-lg overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            {course.courseTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 mb-6">
            {course.subTitle}
          </p>
          <div className="flex flex-col md:flex-row justify-between text-sm text-gray-300">
            <div>
              Created by{" "}
              <span className="text-white font-semibold hover:underline transition duration-200">
                {course.creator?.name || "Unknown Instructor"}
              </span>
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
              <p className="flex items-center gap-1">
                <BadgeInfo size={16} />
                Updated{" "}
                <span className="text-white font-semibold">
                  {course.createdAt?.split("T")[0]}
                </span>
              </p>
              <span className="text-gray-400">|</span>
              <p className="flex items-center gap-1">
                👥{" "}
                <span className="text-white font-semibold">
                  {course.enrolledStudents?.length || 0}
                </span>{" "}
                enrolled
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 space-y-10">
          {/* Description */}
          <Card className="hover:shadow-2xl transition-shadow dark:bg-gray-900 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold dark:text-white">Course Description</CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                What you'll learn and explore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </CardContent>
          </Card>

          {/* Lectures */}
          <Card className="hover:shadow-2xl dark:bg-gray-900 dark:border-gray-700 transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="dark:text-white text-lg">Course Content</CardTitle>
              <CardDescription className="dark:text-gray-400">{totalLectures} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.lectures.map((lecture, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-base group hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-md transition duration-200"
                >
                  <PlayCircle size={18} className="text-blue-600 dark:text-blue-400" />
                  <p className="group-hover:text-blue-700 dark:group-hover:text-blue-400 transition font-medium">
                    {lecture.lectureTitle}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3">
          <Card className="hover:shadow-xl dark:bg-gray-900 dark:border-gray-700 transition duration-300">
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden shadow-lg">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course.lectures[0]?.videoUrl}
                  controls
                  playing
                  onError={(e) => console.error("Error loading video:", e)}
                />
              </div>
              <h1 className="text-xl font-bold dark:text-white mb-2">
                {course.lectures[0]?.lectureTitle}
              </h1>
              <Separator className="my-2 dark:bg-gray-700" />
              <h2 className="text-lg font-extrabold text-blue-700 dark:text-blue-400">
                ₹{course.coursePrice}
              </h2>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold tracking-wide"
                >
                  Continue Course
                </Button>
              ) : (
               <BuyCourseButton courseId={courseId ?? ""} />

              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

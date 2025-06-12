import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
    // Dynamically assign badge color based on course level
    const getBadgeColor = (level) => {
        switch (level) {
            case "Beginner":
                return "bg-green-500";
            case "Medium":
                return "bg-yellow-500";
            case "Advance":
                return "bg-red-600";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Link to={`/course-detail/${course._id}`} className="h-full">
            <Card className="h-full flex flex-col justify-between bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div>
                    {/* Thumbnail */}
                    <div className="relative">
                        <img
                            src={course.courseThumbnail}
                            alt="course"
                            className="w-full h-40 object-cover rounded-t-2xl"
                        />
                    </div>

                    {/* Title & Subtitle */}
                    <CardContent className="px-5 py-4 space-y-2">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">
                            {course.courseTitle}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
                            {course.subTitle}
                        </p>
                    </CardContent>
                </div>

                {/* Footer */}
                <CardContent className="px-5 pb-4 pt-0">
                    <div className="flex items-center justify-between">
                        {/* Creator Info */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
                                    alt={course.creator?.name || "creator"}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    {course.creator?.name || "Unknown Creator"}
                                </p>
                            </div>
                        </div>

                        {/* Level Badge */}
                        <Badge
                            className={`text-white text-xs px-3 py-1 rounded-full shadow-md ${getBadgeColor(
                                course.courseLevel
                            )}`}
                        >
                            {course.courseLevel}
                        </Badge>
                    </div>
                    {/* Price Button Below the Card */}
                    <div className="mt-4 flex justify-center">
                        <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-all duration-300">
                            Enroll Now for ₹{course.coursePrice}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default Course;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteCourseMutation,
  useGetCreatorCourseQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Edit, Loader2, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const CourseTable = () => {
  const { data, isLoading, isError, refetch } = useGetCreatorCourseQuery();
  const [publishCourse, { isLoading: isPublishing }] = usePublishCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const navigate = useNavigate();

  const handlePublish = async (course) => {
    const { _id: courseId, isPublished, lectures } = course;
    const nextStatus = !isPublished;

    if (nextStatus && (!lectures || lectures.length === 0)) {
      toast.warning("Please add at least one lecture before publishing.");
      return;
    }

    try {
      const res = await publishCourse({
        courseId,
        query: nextStatus.toString(),
      }).unwrap();

      toast.success(res.message || `Course ${nextStatus ? "published" : "unpublished"} successfully.`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update course status.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully.");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete course.");
    }
  };

  if (isLoading) return <h1 className="text-center mt-10 text-xl dark:text-white"><LoadingSpinner/></h1>;
  if (isError) return <h1 className="text-center mt-10 text-red-500 dark:text-red-400">Error loading courses. Please try again.</h1>;

  return (
    <div className="p-6 relative">
      <Button
        onClick={() => navigate("create")}
        className="mb-6 hover:scale-105 transition-all duration-300 shadow-md"
      >
        Create New Course
      </Button>

      <Table className="shadow-xl border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <TableCaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          A list of your recent courses.
        </TableCaption>
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">Price</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses.map((course, index) => (
            <motion.tr
              key={course._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <TableCell className="font-semibold text-gray-800 dark:text-gray-100">
                ₹{course.coursePrice || "NA"}
              </TableCell>
              <TableCell>
                <Badge
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all
                    ${course.isPublished
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-100 font-medium">
                {course.courseTitle}
              </TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${course._id}`)}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </Button>

                <Button
                  variant={course.isPublished ? "destructive" : "primary"}
                  size="sm"
                  disabled={isPublishing}
                  onClick={() => handlePublish(course)}
                  className={`text-white ${
                    course.isPublished
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : course.isPublished ? "Unpublish" : "Publish"}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCourse(course._id)}
                  className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;

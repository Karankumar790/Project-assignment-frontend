import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useEditCourseMutation,
    useGetCourseByIdQuery,
    usePublishCourseMutation,
    useDeleteCourseMutation,
} from "@/features/api/courseApi";

const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });

    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const { courseId } = useParams();
    const navigate = useNavigate();

    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId);
    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    const [publishCourse, { isLoading: isPublishing }] = usePublishCourseMutation();
    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

    const categories = useMemo(() => [
        "Next JS", "Data Science", "Frontend Development", "Fullstack Development",
        "MERN Stack Development", "Javascript", "Python", "Docker", "MongoDB", "HTML"
    ], []);

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData.course;
            setInput({
                courseTitle: course.courseTitle || "",
                subTitle: course.subTitle || "",
                description: course.description || "",
                category: course.category || "",
                courseLevel: course.courseLevel || "",
                coursePrice: course.coursePrice || "",
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const selectCategory = (value) => setInput((prev) => ({ ...prev, category: value }));
    const selectCourseLevel = (value) => setInput((prev) => ({ ...prev, courseLevel: value }));

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput((prev) => ({ ...prev, courseThumbnail: file }));
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updateCourseHandler = async () => {
        try {
            const formData = new FormData();
            Object.entries(input).forEach(([key, value]) => {
                if (key === "courseThumbnail" && value instanceof File) {
                    formData.append(key, value);
                } else if (key === "coursePrice") {
                    formData.append(key, Number(value));
                } else if (value) {
                    formData.append(key, value);
                }
            });
            await editCourse({ formData, courseId }).unwrap();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update course");
        }
    };

    const publishStatusHandler = async () => {
        const course = courseByIdData?.course;
        const hasLectures = Array.isArray(course?.lectures) && course.lectures.length > 0;
        const nextStatus = !course?.isPublished;

        if (nextStatus && !hasLectures) {
            return toast.warning("Please add at least one lecture before publishing.");
        }

        try {
            const res = await publishCourse({
                courseId,
                publish: nextStatus.toString(),
            }).unwrap();

            toast.success(res.message || `Course ${nextStatus ? "published" : "unpublished"} successfully.`);
            await refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update course status.");
        }
    };

    const handleDeleteCourse = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await deleteCourse(courseId).unwrap();
            toast.success("Course deleted successfully");
            navigate("/admin/course");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to remove course");
        }
    };

    useEffect(() => {
        if (isSuccess) toast.success(data?.message || "Course updated.");
        if (error) toast.error(error?.data?.message || "Failed to update course");
    }, [isSuccess, error]);

    if (courseByIdLoading) return <h1 className="text-gray-800 dark:text-gray-200">Loading...</h1>;

    const isPublishDisabled = isPublishing || (!courseByIdData?.course?.isPublished && !courseByIdData?.course?.lectures?.length);

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Basic Course Information
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                        Update your course details here.
                    </CardDescription>
                </div>

                <div className="space-x-2 flex items-center justify-end">
                    <div className="relative group">
                        <Button 
                            disabled={isPublishDisabled} 
                            variant="outline" 
                            onClick={publishStatusHandler}
                            className="transition duration-200 ease-in-out transform hover:bg-green-500 hover:text-white"
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : courseByIdData?.course?.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        {isPublishDisabled && (
                            <div className="absolute -bottom-9 left-0 z-10 w-max bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                Add at least one lecture to publish
                            </div>
                        )}
                    </div>
                    <Button 
                        variant="destructive" 
                        onClick={handleDeleteCourse}
                        className="transition duration-200 ease-in-out transform hover:bg-red-600 hover:text-white"
                    >
                        {isDeleting ? "Removing..." : "Remove Course"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 mt-5">
                <div>
                    <Label className="font-semibold text-gray-700 dark:text-gray-300">Title</Label>
                    <Input
                        type="text"
                        name="courseTitle"
                        value={input.courseTitle}
                        onChange={changeEventHandler}
                        placeholder="Ex. Fullstack developer"
                    />
                </div>

                <div>
                    <Label className="font-semibold text-gray-700 dark:text-gray-300">Subtitle</Label>
                    <Input
                        type="text"
                        name="subTitle"
                        value={input.subTitle}
                        onChange={changeEventHandler}
                        placeholder="Ex. Become a Fullstack developer from zero to hero"
                    />
                </div>

                <div>
                    <Label className="font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                    <RichTextEditor input={input} setInput={setInput} />
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div>
                        <Label className="font-semibold text-gray-700 dark:text-gray-300">Category</Label>
                        <Select defaultValue={input.category} onValueChange={selectCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="font-semibold text-gray-700 dark:text-gray-300">Course Level</Label>
                        <Select defaultValue={input.courseLevel} onValueChange={selectCourseLevel}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a course level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Course Level</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="font-semibold text-gray-700 dark:text-gray-300">Price (INR)</Label>
                        <Input
                            type="number"
                            name="coursePrice"
                            value={input.coursePrice}
                            onChange={changeEventHandler}
                            placeholder="199"
                            className="w-fit"
                        />
                    </div>
                </div>

                <div>
                    <Label className="font-semibold text-gray-700 dark:text-gray-300">Course Thumbnail</Label>
                    <Input
                        type="file"
                        onChange={selectThumbnail}
                        accept="image/*"
                        className="w-fit"
                    />
                    {previewThumbnail && (
                        <img src={previewThumbnail} className="h-32 mt-2 rounded-md transition duration-200 ease-in-out hover:scale-105" alt="Course Thumbnail" />
                    )}
                </div>

                <div className="flex gap-3">
                    <Button onClick={() => navigate("/admin/course")} variant="outline">
                        Cancel
                    </Button>
                    <Button disabled={isLoading} onClick={updateCourseHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;

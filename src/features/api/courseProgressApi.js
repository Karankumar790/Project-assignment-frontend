import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "https://backend-project-assignment.onrender.com/api/v1/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  tagTypes: ["CourseProgress"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),

    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: "CourseProgress", id: courseId }],
    }),

    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),

    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = courseProgressApi;

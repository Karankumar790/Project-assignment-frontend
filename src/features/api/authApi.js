import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "https://backend-project-assignment.onrender.com/api/v1/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include", // Ensure cookies are sent with all requests
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
 
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "user/register",
        method: "POST",
        body: inputData,
      }),
    }),

    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "user/login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
          authApi.util.invalidateTags(["Profile"]);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "user/logout",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(userLoggedOut());
          authApi.util.invalidateTags(["Profile"]);
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "user/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error("Load profile error:", error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "user/profile/update",
        method: "PUT",
        body: formData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (inputData) => ({
        url: "user/forgotPassword",
        method: "POST",
        body: inputData,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, otp, newPassword, confirmPassword }) => ({
        url: "user/resetPassword",
        method: "POST",
        body: { email, otp, newPassword, confirmPassword },
      }),
    }),
    queries: builder.mutation({
      query: ({ name, email, message }) => ({
        url: "user/queries",
        method: "POST",
        body: { name, email, message },
      }),
    }),
    getQueries: builder.query({
      query: () => ({
        url: "user/getAllQueries",
        method: "GET",
      }),
      providesTags: ["Queries"],
    }),
    deleteQuery: builder.mutation({
      query: (queryId) => ({
        url: `user/deleteQueries/${queryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Queries"],
    }),
    replyToQuery: builder.mutation({
      query: ({ id, replyMessage }) => ({
        url: `user/queryReply/${id}`,
        method: "PUT",
        body: { replyMessage },
      }),
      invalidatesTags: ["Queries"], 
    }),
    allUsers: builder.query({
      query: () => ({
        url: "user/getAllUsers",
        method: "GET",
      }),
      providesTags: ["Queries"],
    }),
    allUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `user/getAllUsers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    createPost: builder.mutation({
      query: (formData) => ({
        url: "userPost/post",
        method: "POST",
        body: formData,
      }),
    }),
    getAllUserPosts: builder.query({
      query: ({ page = 1, limit = 4 }) => ({
        url: `userPost/getAllUserPost?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    getUserPosts: builder.query({
      query: () => ({
        url: `userPost/post`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `userPost/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useQueriesMutation,
  useGetQueriesQuery,
  useDeleteQueryMutation,
  useReplyToQueryMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useCreatePostMutation,
  useGetAllUserPostsQuery,
  useGetUserPostsQuery,
  useDeletePostMutation,
} = authApi;

import { useDeletePostMutation, useGetAllUserPostsQuery } from "@/features/api/authApi";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const AllUserPost = () => {
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data, isLoading, isError, refetch } = useGetAllUserPostsQuery({
    page,
    limit,
  });
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const posts = data?.data || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id).unwrap();
        refetch(); 
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Error deleting the post");
      }
    }
  };

  const handleNext = () => {
    if (posts.length === limit) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">User Posts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm text-left text-white bg-gray-900">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Title</th>
              <th className="px-4 py-3 border">URL Preview</th>
              <th className="px-4 py-3 border">Caption</th>
              <th className="px-4 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id} className="bg-gray-800 border-t">
                <td className="px-4 py-2 border">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-4 py-2 border">{post.postName}</td>
                <td className="px-4 py-2 border">
                  {post.postImageOrVedio.includes(".mp4") ? (
                    <video
                      src={post.postImageOrVedio}
                      className="h-12 w-20 object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={post.postImageOrVedio}
                      alt={post.postName}
                      className="h-12 w-20 object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-2 border">{post.caption}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 text-white">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-800"
            }`}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={handleNext}
            disabled={posts.length < limit}
            className={`px-3 py-1 rounded ${
              posts.length < limit
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
        {posts?.length === 0 && (
          <p className="text-center text-gray-400 py-4">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default AllUserPost;

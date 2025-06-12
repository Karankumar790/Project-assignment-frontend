import { useAllUsersQuery, useDeleteUserMutation } from "@/features/api/authApi";
import React, { useState } from "react";

const Users = () => {

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useAllUsersQuery({ page, limit });
  const [deleteUser] = useDeleteUserMutation();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const totalUsers = data?.totalUsers || 0; 
  const totalPages = Math.ceil(totalUsers / limit);

  const openPhotoModal = (photoUrl) => setSelectedPhoto(photoUrl);
  const closePhotoModal = () => setSelectedPhoto(null);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error fetching users</p>;
  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">User Queries</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                #
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                Email
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                photo url
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((user, index) => (
              <tr key={user._id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="py-3 px-4 border-b border-gray-700">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.name}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.email}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => openPhotoModal(user.photo)}
                  />
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm text-white">
            Page {page} of {totalPages || 1}
          </span>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closePhotoModal}
        >
          <div
            className="bg-white p-2 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-64 h-64 object-contain rounded"
            />
            <button
              className="block mt-2 mx-auto bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
              onClick={closePhotoModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

import React, { useState } from "react";
import {
  useDeleteQueryMutation,
  useGetQueriesQuery,
  useReplyToQueryMutation,
} from "@/features/api/authApi";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const UserQueries = () => {
  const { data, isLoading, error } = useGetQueriesQuery();
  const [deleteQuery] = useDeleteQueryMutation();
  const [replyToQuery] = useReplyToQueryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleDelete = async (id) => {
    try {
      await deleteQuery(id).unwrap();
    } catch (err) {
      console.error("Failed to delete query:", err);
    }
  };

  const openReplyModal = (query) => {
    setSelectedQuery(query);
    setReplyMessage("");
    setIsModalOpen(true);
  };

  const handleSendReply = async () => {
  try {
    await replyToQuery({
      id: selectedQuery._id,
      replyMessage,
    }).unwrap();

    alert("Reply sent successfully!");
    setIsModalOpen(false);
  } catch (err) {
    console.error("Failed to send reply:", err);
    alert("Failed to send reply.");
  }
};
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error fetching queries</p>;

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
                Message
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                Action
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-700">
                Reply
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((query, index) => (
              <tr key={query._id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="py-3 px-4 border-b border-gray-700">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {query.name}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {query.email}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {query.message}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <button
                    onClick={() => handleDelete(query._id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <button
                    onClick={() => openReplyModal(query)}
                    className="text-blue-400 hover:text-blue-600"
                    title="Reply"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Reply to {selectedQuery?.name}
            </h3>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              rows="4"
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQueries;

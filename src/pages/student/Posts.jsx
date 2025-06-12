import { useCreatePostMutation } from "@/features/api/authApi";
import React, { useState } from "react";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // Actual file object
  const [preview, setPreview] = useState(null); // For image/video preview

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);

    if (file?.type.startsWith("image/") || file?.type.startsWith("video/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !caption || !mediaFile) {
      alert("Please fill all fields and select media.");
      return;
    }

    const formData = new FormData();
    formData.append("postName", title);
    formData.append("caption", caption);
    formData.append("media", mediaFile);

    try {
      await createPost(formData).unwrap();
      alert("Post uploaded successfully!");
      setTitle("");
      setCaption("");
      setMediaFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Post upload error:", err);
      alert("Failed to upload post.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto bg-[#161B22] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Create a New Post</h2>

        {/* Post Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Upload Image or Video
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Caption</label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Write something..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-medium"
          >
            {isLoading ? "Uploading..." : "Upload Post"}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="max-w-3xl mx-auto mt-10 bg-[#161B22] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Post Preview</h3>
        <p className="text-lg font-bold mb-2">{title || "Title goes here"}</p>
        {preview && (
          <>
            {mediaFile?.type.startsWith("image/") ? (
              <img
                src={preview}
                alt="Preview"
                className="mb-4 rounded max-h-60 object-cover"
              />
            ) : (
              <video controls className="mb-4 w-full max-h-60 rounded">
                <source src={preview} type="video/mp4" />
              </video>
            )}
          </>
        )}
        <p className="text-sm text-gray-300">
          {caption || "Your caption will appear here."}
        </p>
      </div>
    </div>
  );
};

export default PostPage;

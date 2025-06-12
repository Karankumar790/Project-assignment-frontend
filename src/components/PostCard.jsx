import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {post.postImageOrVedio && (
        <>
          {post.postImageOrVedio.endsWith(".mp4") ||
          post.postImageOrVedio.includes("video") ? (
            <video
              src={post.postImageOrVedio}
              controls
              autoPlay={true}
              className="w-full h-36 object-cover"
            />
          ) : (
            <img
              src={post.postImageOrVedio}
              alt={post.postName}
              className="w-full h-36 object-cover"
            />
          )}
        </>
      )}

      <div className="px-4 py-3">
        <h3 className="text-black font-semibold text-lg mb-2">{post.postName}</h3>
        <p className="text-gray-800 text-sm">{post.description}</p>
        <p className="text-sm text-gray-500 mt-2">By: {post.caption}</p>
      </div>
    </div>
  );
};

export default PostCard;

import React from "react";

export default function FileCard({ file, onDelete, onPreview }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded shadow hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {file.type === "pdf" ? "📄" :
           file.type === "video" ? "🎥" :
           file.type === "image" ? "🖼️" :
           file.type === "folder" ? "📁" : "📄"}
        </span>

        <div>
          <button
            onClick={() => onPreview(file)}
            className="font-medium text-blue-600 hover:underline"
          >
            {file.name}
          </button>
          <div className="text-xs text-gray-500">
            {file.size ? `${(file.size / 1024).toFixed(1)} KB` : `${file.children?.length} files`}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(file.id)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Delete
      </button>
    </div>
  );
}

import React from "react";

export default function UploadModal({ onUpload }) {
  return (
    <label className="cursor-pointer">
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) onUpload(f);
        }}
      />
      <span className="px-4 py-2 bg-blue-600 text-white rounded">
        Upload File
      </span>
    </label>
  );
}

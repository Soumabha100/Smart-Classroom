import React from "react";

export default function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-200 rounded h-3">
      <div
        className="h-3 bg-blue-600 rounded"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

import React from "react";

export default function ModuleCard({ module, onStart }) {
  return (
    <div className="p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <div className="font-semibold">{module.title}</div>
        <div className="text-xs text-gray-500">{module.type}</div>
      </div>
      <button
        onClick={() => onStart(module)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {module.done ? "Review" : "Start"}
      </button>
    </div>
  );
}

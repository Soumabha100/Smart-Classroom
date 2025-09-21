import React from "react";
import { BookCopy, Users, Trash2, Edit } from "lucide-react";

const ClassCard = ({ cls, onDelete }) => {
  return (
    <div className="p-5 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
          {cls.name}
        </h3>
        <p className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
          <BookCopy className="w-4 h-4" />
          {cls.subject || "Not specified"}
        </p>
        <p className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
          <Users className="w-4 h-4" />
          {cls.students?.length || 0} Students
        </p>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(cls._id)}
          className="p-2 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ClassCard;

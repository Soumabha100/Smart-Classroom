import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  User,
  BookOpen,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";

const Stat = ({ icon, count, label }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
    {icon}
    <span className="font-medium text-slate-700 dark:text-slate-300">
      {count}
    </span>
    <span>{label}</span>
  </div>
);

const ClassCard = ({ cls, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/class/${cls._id}`);
  };

  // This logic handles both old and new data structures
  const teacherCount = Array.isArray(cls.teachers)
    ? cls.teachers.length // If 'teachers' is an array, use its length
    : cls.teacher
    ? 1
    : 0; // Otherwise, check if the single 'teacher' exists

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
      {/* Card Header */}
      <div className="p-4 md:p-5 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="inline-flex justify-center items-center w-12 h-12 rounded-lg border-2 border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">
              {cls.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Subject: {cls.subject || "Not specified"}
            </p>
          </div>
        </div>

        {/* Advanced Options Menu */}
        <Menu as="div" className="relative">
          <MenuButton className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
            <MoreVertical size={20} />
          </MenuButton>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              anchor="bottom end"
              className="w-40 origin-top-right bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <MenuItem>
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Edit size={16} /> Edit Class
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onDelete(cls._id)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                  >
                    <Trash2 size={16} /> Delete Class
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* Card Body with Stats */}
      <div className="p-4 md:p-5 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-col gap-3">
          <Stat
            icon={<Users size={16} />}
            count={(cls.students || []).length}
            label="Students"
          />
          <Stat
            icon={<User size={16} />}
            count={teacherCount} // Use the new calculated count
            label="Teachers"
          />
        </div>
      </div>

      {/* Card Footer with "View" button */}
      <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl mt-auto">
        <button
          onClick={handleViewDetails}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Eye size={16} />
          View Class Details
        </button>
      </div>
    </div>
  );
};

export default ClassCard;

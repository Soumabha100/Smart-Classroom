import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Users,
  BookCopy,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
// This is the corrected import line
import {
  getTeacherClasses,
  createClass,
  deleteClass,
} from "../../api/apiService";

const TeacherClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");

  const fetchClasses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const fetchedClasses = await getTeacherClasses();
      setClasses(fetchedClasses);
    } catch (err) {
      setError("Failed to load classes. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassSubject.trim()) {
      setError("Please provide both a name and a subject.");
      return;
    }
    setIsCreating(true);
    setError("");
    try {
      await createClass({ name: newClassName, subject: newClassSubject });
      setNewClassName("");
      setNewClassSubject("");
      fetchClasses(); // Refresh the list of classes
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this class? This action cannot be undone."
      )
    ) {
      try {
        await deleteClass(classId);
        fetchClasses(); // Refresh the list
      } catch (err) {
        setError("Failed to delete class.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        {" "}
        <LoaderCircle className="w-8 h-8 mx-auto animate-spin text-indigo-500" />{" "}
        <p>Loading your classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create Class Form */}
      <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-800 dark:text-white mb-4">
          <PlusCircle className="w-6 h-6 text-indigo-500" />
          Create a New Class
        </h3>
        <form
          onSubmit={handleCreateClass}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
        >
          <div className="sm:col-span-1">
            <label
              htmlFor="newClassName"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Class Name
            </label>
            <input
              id="newClassName"
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g., Grade 10 Physics"
              className="w-full input-style"
            />
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="newClassSubject"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Subject
            </label>
            <input
              id="newClassSubject"
              type="text"
              value={newClassSubject}
              onChange={(e) => setNewClassSubject(e.target.value)}
              placeholder="e.g., Physics"
              className="w-full input-style"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="sm:col-span-1 inline-flex items-center justify-center w-full gap-2 px-4 py-2 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg h-10 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95 disabled:bg-indigo-400"
          >
            {isCreating ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" /> Creating...
              </>
            ) : (
              "Create Class"
            )}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Existing Classes List */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Your Classes
        </h3>
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="p-5 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {cls.name}
                  </h4>
                  <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <BookCopy className="w-4 h-4" />{" "}
                    {cls.subject || "Not specified"}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Users className="w-4 h-4" /> {cls.students?.length || 0}{" "}
                    Students
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 text-sm py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
                    View Students
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls._id)}
                    className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white border rounded-lg dark:bg-slate-800 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              You haven't created any classes yet. Use the form above to get
              started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClassManager;

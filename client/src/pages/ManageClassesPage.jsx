import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, AlertCircle, LoaderCircle, ArrowLeft } from "lucide-react";
import { getTeacherClasses, createClass, deleteClass } from "../api/apiService"; // Corrected API call
import DashboardLayout from "../components/DashboardLayout"; // FIX: Import DashboardLayout
import ClassCard from "../components/Class/ClassCard"; // Import new component
import CreateClassModal from "../components/Class/CreateClassModal"; // Import new component

const ManageClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // FIX: Fetch only the classes for the logged-in teacher
      const data = await getTeacherClasses();
      setClasses(data);
    } catch (err) {
      setError("Failed to load your classes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreateClass = async (classData) => {
    await createClass(classData);
    setIsModalOpen(false);
    fetchClasses(); // Refresh the list
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

  return (
    // FIX: Wrap everything in DashboardLayout
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* FIX: Add professional header with back button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)} // Navigates to the previous page
              className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Class Management
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                A central place to create, view, and manage all your classes.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Class</span>
            </button>
          </div>

          <CreateClassModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleCreateClass}
          />

          {loading && (
            <div className="text-center p-8">
              <LoaderCircle className="w-8 h-8 mx-auto animate-spin text-indigo-500" />
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center gap-2 p-4 text-red-600 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <ClassCard
                    key={cls._id}
                    cls={cls}
                    onDelete={handleDeleteClass}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 px-6 bg-white border rounded-lg dark:bg-slate-800 dark:border-slate-700">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    No Classes Found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Get started by creating your first class using the button
                    above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageClassesPage;

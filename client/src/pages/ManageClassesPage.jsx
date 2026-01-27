import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
// Import updateClass from your apiService
import {
  getTeacherClasses,
  createClass,
  deleteClass,
  updateClass,
} from "../api/apiService";
import DashboardLayout from "../components/DashboardLayout";
import ClassCard from "../components/Class/ClassCard";
import CreateClassModal from "../components/Class/CreateClassModal";
import EditClassModal from "../components/Class/EditClassModal"; // 1. Import EditClassModal

const ManageClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- 2. Add state for the Edit Modal ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const navigate = useNavigate();

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTeacherClasses();
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
    setIsCreateModalOpen(false);
    fetchClasses(); // Refresh the list
  };

  // --- 3. Add handler for opening the Edit Modal ---
  const handleOpenEditModal = (cls) => {
    setSelectedClass(cls);
    setIsEditModalOpen(true);
  };

  // --- 4. Add handler for saving the edited class ---
  const handleUpdateClass = async (classId, classData) => {
    try {
      await updateClass(classId, classData);
      setIsEditModalOpen(false);
      fetchClasses(); // Refresh the list
    } catch (err) {
      setError("Failed to update class. Please try again.");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await deleteClass(classId);
        fetchClasses(); // Refresh the list
      } catch (err) {
        setError("Failed to delete class.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
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
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Class</span>
            </button>
          </div>

          <CreateClassModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateClass}
          />

          {/* --- 5. Add the EditClassModal component --- */}
          <EditClassModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateClass}
            classData={selectedClass}
          />

          {loading && (
            <div className="text-center p-8">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-500" />
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
                    onEdit={() => handleOpenEditModal(cls)} // 6. Pass the onEdit handler
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 px-6 bg-white border rounded-lg dark:bg-slate-800 dark:border-slate-700">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    No Classes Found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Get started by creating your first class.
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

import React, { useState, useEffect, useCallback } from "react";
import { getParents, getAllStudents, createParent } from "../api/apiService"; // We'll use your centralized apiService
import DashboardLayout from "../components/DashboardLayout";
import {
  Users,
  UserPlus,
  ShieldCheck,
  X,
  LoaderCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// A new, beautifully designed card to display parent information
const ParentCard = ({ parent }) => (
  <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col h-full">
    <div className="flex items-start gap-4">
      <img
        src={parent.avatar || "/assets/default_avatar.png"}
        alt={parent.name}
        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-300 dark:border-indigo-600"
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {parent.name}
        </h3>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium break-all">
          {parent.email}
        </p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
        Linked Children
      </h4>
      <div className="flex flex-wrap gap-2">
        {parent.students && parent.students.length > 0 ? (
          parent.students.map((student) => (
            <span
              key={student._id}
              className="px-3 py-1 text-sm font-medium bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-full"
            >
              {student.name}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500 italic">No children linked.</p>
        )}
      </div>
    </div>
  </div>
);

// Main Component
const ParentManagementPage = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all necessary data on component mount
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Using Promise.all for efficient, parallel data fetching
      const [parentsRes, studentsRes] = await Promise.all([
        getParents(),
        getAllStudents(),
      ]);
      setParents(parentsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      setError("Failed to fetch initial data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Modern way to handle student selection with a Set for performance
  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formState.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setIsSubmitting(true);
    try {
      const parentData = {
        ...formState,
        studentIds: Array.from(selectedStudents), // Convert Set to Array for API
      };
      const res = await createParent(parentData);
      setSuccess(`Parent "${res.data.name}" was created successfully!`);
      // Reset form state completely
      setFormState({ name: "", email: "", password: "" });
      setSelectedStudents(new Set());
      fetchData(); // Refresh the parent list
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create parent account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Parent Account Management
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Create and manage parent accounts for your institution.
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Create Parent Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-white mb-6">
                  <UserPlus className="text-indigo-500" />
                  Create New Parent
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Parent's Full Name"
                    required
                    className="input-style" // Use your global input style
                  />
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Parent's Email"
                    required
                    className="input-style"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleInputChange}
                    placeholder="Set Temporary Password"
                    required
                    className="input-style"
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Link Children Accounts
                    </label>
                    <div className="max-h-48 overflow-y-auto border dark:border-slate-600 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/50">
                      {students.map((student) => (
                        <div
                          key={student._id}
                          onClick={() => handleStudentToggle(student._id)}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            selectedStudents.has(student._id)
                              ? "bg-indigo-100 dark:bg-indigo-600/50"
                              : "hover:bg-slate-200 dark:hover:bg-slate-600/50"
                          }`}
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {student.name}
                          </span>
                          {selectedStudents.has(student._id) && (
                            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertTriangle size={16} /> {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-green-500 text-sm flex items-center gap-2">
                      <CheckCircle2 size={16} /> {success}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-bold text-white transition-transform transform bg-indigo-600 rounded-md hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-400 disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Parent Account"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing Parents List */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-white mb-6">
                <Users className="text-indigo-500" />
                Registered Parents ({parents.length})
              </h2>
              {isLoading ? (
                <div className="text-center py-10">
                  <LoaderCircle className="w-8 h-8 mx-auto animate-spin text-indigo-500" />
                </div>
              ) : parents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parents.map((parent) => (
                    <ParentCard key={parent._id} parent={parent} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed dark:border-slate-700 rounded-xl">
                  <p className="text-slate-500 dark:text-slate-400">
                    No parent accounts have been created yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentManagementPage;

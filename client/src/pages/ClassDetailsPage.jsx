import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getClassDetails,
  getAllStudents,
  addStudentToClass,
} from "../api/apiService";
import DashboardLayout from "../components/DashboardLayout";
import {
  LoaderCircle,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Users,
  UserPlus,
} from "lucide-react";

// Reusable Stat Card component
const DetailStat = ({ icon, label, value }) => (
  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-indigo-200 dark:bg-indigo-900/50 rounded-full">
      {React.cloneElement(icon, {
        className: "w-6 h-6 text-indigo-600 dark:text-indigo-400",
      })}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const ClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classDetails, setClassDetails] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [studentIdToAdd, setStudentIdToAdd] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const fetchAllData = useCallback(async () => {
    // A check to prevent API calls with an undefined ID
    if (!classId) {
      setLoading(false);
      setError("Class ID is missing.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const [classRes, studentsRes] = await Promise.all([
        getClassDetails(classId),
        getAllStudents(),
      ]);
      setClassDetails(classRes.data);
      setAllStudents(studentsRes.data || []);
    } catch (err) {
      setError("Failed to fetch class details. The class may not exist.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentIdToAdd) {
      alert("Please select a student to enroll.");
      return;
    }
    setIsEnrolling(true);
    try {
      const { data } = await addStudentToClass(classId, studentIdToAdd);
      setClassDetails(data);
      setStudentIdToAdd("");
    } catch (err) {
      alert("Failed to enroll student. They may already be in the class.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoaderCircle className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/teacher/manage-classes")}
              className="p-2 rounded-full transition-colors bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {classDetails?.name || "Class Details"}
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Detailed class overview and management.
              </p>
            </div>
          </div>

          {/* This check is crucial for the initial render */}
          {!classDetails ? (
            <div className="text-center p-10 text-slate-500">
              Class not found or failed to load.
            </div>
          ) : (
            <>
              {/* Class Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DetailStat
                  icon={<BookOpen />}
                  label="Subject"
                  value={classDetails.subject || "N/A"}
                />
                <DetailStat
                  icon={<Users />}
                  label="Enrolled Students"
                  value={classDetails.students?.length || 0}
                />
              </div>

              {/* Student Management Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
                    Enrolled Students
                  </h2>
                  <div className="max-h-96 overflow-y-auto pr-2">
                    {classDetails.students?.length > 0 ? (
                      <ul className="space-y-3">
                        {classDetails.students.map((student) => (
                          <li
                            key={student._id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  student.avatar || "/assets/default_avatar.png"
                                }
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                  {student.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-10 text-slate-500 dark:text-slate-400">
                        No students are enrolled in this class yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Enroll Student Form */}
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <UserPlus size={22} /> Enroll a Student
                  </h2>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label
                        htmlFor="student-select"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Select Student
                      </label>
                      <select
                        id="student-select"
                        value={studentIdToAdd}
                        onChange={(e) => setStudentIdToAdd(e.target.value)}
                        className="w-full input-style"
                        required
                      >
                        <option value="" disabled>
                          {" "}
                          -- Select a student --{" "}
                        </option>
                        {allStudents.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.name} ({student.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isEnrolling}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 font-bold text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                      {isEnrolling ? (
                        <>
                          <LoaderCircle className="w-5 h-5 animate-spin" />{" "}
                          Enrolling...
                        </>
                      ) : (
                        "Enroll Student"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClassDetailsPage;

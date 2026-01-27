import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getClassDetails,
  getAllStudents,
  addStudentToClass,
} from "../api/apiService";
import DashboardLayout from "../components/DashboardLayout";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Users,
  UserPlus,
} from "lucide-react";

// A reusable component for displaying key class statistics. No changes needed here.
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
    if (!classId) {
      setLoading(false);
      setError("Class ID is missing from the URL.");
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
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch class details. Please check the console for more information.";
      setError(errorMessage);
      console.error("Error fetching data:", err); // Keep this for debugging
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
      const errorMessage =
        err.response?.data?.message ||
        "Failed to enroll student. They may already be in the class.";
      alert(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  const availableStudents = useMemo(() => {
    if (!classDetails) return allStudents;
    const enrolledIds = new Set(classDetails.students.map((s) => s._id));
    return allStudents.filter((student) => !enrolledIds.has(student._id));
  }, [allStudents, classDetails]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  // *** THIS IS THE FIX ***
  // We now handle the rendering logic inside the main return statement.
  // This ensures we don't try to access `classDetails.subject` if `classDetails` is null.
  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/teacher/manage-classes")}
              className="p-2 rounded-full transition-colors bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {/* Still safe to use optional chaining here */}
                {classDetails?.name || "Class Details"}
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Detailed class overview and student management.
              </p>
            </div>
          </div>

          {/* If there's an error, display it prominently */}
          {error && (
            <div className="p-4 mb-6 text-center text-red-600 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          )}

          {/* FIX APPLIED HERE:
            Only render the main content if loading is finished, there's no error, 
            AND `classDetails` actually has data.
          */}
          {!loading && !error && classDetails ? (
            <>
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
                                alt={`${student.name}'s avatar`}
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

                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <UserPlus size={22} /> Enroll a New Student
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
                        className="w-full input-style disabled:bg-slate-100 dark:disabled:bg-slate-700"
                        required
                        disabled={availableStudents.length === 0}
                      >
                        <option value="" disabled>
                          {availableStudents.length > 0
                            ? "-- Select a student --"
                            : "-- No students to add --"}
                        </option>
                        {availableStudents.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.name} ({student.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isEnrolling || !studentIdToAdd}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 font-bold text-white transition-transform transform bg-indigo-600 rounded-md hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-400 disabled:scale-100 dark:disabled:bg-indigo-800"
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
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
          ) : (
            // If there's no error but classDetails is still null after loading, show a message.
            !error && (
              <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-500">
                  Class data could not be loaded.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClassDetailsPage;

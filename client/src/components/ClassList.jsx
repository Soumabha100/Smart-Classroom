import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getClasses } from "../api/apiService"; // 1. Import the specific function

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses(); // 2. Use the simplified, centralized function
        setClasses(res.data);
      } catch (err) {
        setError("Failed to fetch classes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Classes</h2>
        <Link
          to="/manage-classes"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
        >
          Manage
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {classes.length > 0
          ? classes.map((classItem) => (
              <div key={classItem._id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg">{classItem.name}</h3>
                <p className="text-sm text-slate-600">
                  Teacher: {classItem.teacher.name}
                </p>
                <p className="text-sm text-slate-500">
                  Students: {classItem.students.length}
                </p>
              </div>
            ))
          : !loading && <p className="text-slate-500">No classes found.</p>}
      </div>
    </div>
  );
};

export default ClassList;

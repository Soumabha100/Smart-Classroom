import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });
        const res = await api.get('/api/classes');
        setClasses(res.data);
      } catch (err) {
        setError('Failed to fetch classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Classes</h2>
        <Link to="/manage-classes" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Manage Classes
        </Link>
      </div>
      {loading && <p>Loading classes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {classes.map((classItem) => (
          <div key={classItem._id} className="border p-4 rounded-lg">
            <h3 className="font-bold text-lg">{classItem.name}</h3>
            <p className="text-sm text-slate-600">Teacher: {classItem.teacher.name}</p>
            <p className="text-sm text-slate-500">Students: {classItem.students.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassList;
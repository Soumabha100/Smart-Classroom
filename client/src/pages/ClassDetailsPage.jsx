import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const ClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [studentIdToAdd, setStudentIdToAdd] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, studentsRes] = await Promise.all([
          api.get(`/api/classes/${classId}`), // We will create this endpoint next
          api.get('/api/users/students')      // We will create this endpoint next
        ]);
        setClassDetails(classRes.data);
        setAllStudents(studentsRes.data);
      } catch (err) {
        setError('Failed to fetch class details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/classes/${classId}/students`, { studentId: studentIdToAdd });
      setClassDetails(res.data); // Update with the returned class details
      setStudentIdToAdd('');
    } catch (err) {
      alert('Failed to add student.');
    }
  };
  
  const handleDeleteClass = async () => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/api/classes/${classId}`);
        alert('Class deleted successfully.');
        navigate('/manage-classes');
      } catch (err) {
        alert('Failed to delete class.');
      }
    }
  };

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Class: {classDetails?.name}</h1>
        <p className="text-slate-600">Teacher: {classDetails?.teacher.name}</p>
      </header>
      
      {/* Student Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">Enroll a Student</h2>
        <form onSubmit={handleAddStudent} className="flex gap-2">
          <select value={studentIdToAdd} onChange={(e) => setStudentIdToAdd(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">-- Select a Student --</option>
            {allStudents.map(student => (
              <option key={student._id} value={student._id}>{student.name} ({student.email})</option>
            ))}
          </select>
          <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">Enroll</button>
        </form>

        <h3 className="text-xl font-semibold mt-6 mb-4">Enrolled Students ({classDetails.students.length})</h3>
        <ul className="list-disc pl-5">
          {classDetails.students.map(student => <li key={student._id}>{student.name}</li>)}
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-6 rounded-lg shadow-md mt-8 border border-red-200">
        <h2 className="text-2xl font-semibold mb-4 text-red-800">Danger Zone</h2>
        <button onClick={handleDeleteClass} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
          Delete This Class
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ClassDetailsPage;
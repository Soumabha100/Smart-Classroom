import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import Sidebar from "../components/Sidebar";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        // Fetch user profile and activities in parallel
        const [profileRes, activitiesRes] = await Promise.all([
          api.get("/api/users/profile"),
          api.get("/api/activities"),
        ]);

        setUser(profileRes.data);
        setActivities(activitiesRes.data);

        if (
          !profileRes.data.profile ||
          profileRes.data.profile.academicInterests.length === 0
        ) {
          navigate("/onboarding");
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleScan = async (data) => {
    if (data) {
      setShowScanner(false);
      const token = localStorage.getItem("token");
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await api.post("/api/attendance/mark", {
          qrToken: data.text,
        });
        alert(res.data.message);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to mark attendance.");
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100">
      <Sidebar />
      <main className="flex-grow ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600">
            Here's a look at what's happening today.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">
                Recommended For You
              </h2>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="border p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-bold">{activity.title}</h3>
                        <p className="text-sm text-slate-600">
                          {activity.description}
                        </p>
                      </div>
                      <a
                        href={activity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No activities found. Check back later!</p>
                )}
              </div>
            </div>
          </div>

          {/* Side Content Area */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">
                Attendance
              </h2>
              <p className="text-slate-600 mb-4">
                Scan the QR code in your classroom to mark your attendance.
              </p>
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                {showScanner ? "Close Scanner" : "Scan QR Code"}
              </button>
              {showScanner && (
                <div className="mt-4 border-2 border-dashed p-2 rounded-lg">
                  <Scanner
                    onScan={handleScan}
                    onError={(error) => console.log(error?.message)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

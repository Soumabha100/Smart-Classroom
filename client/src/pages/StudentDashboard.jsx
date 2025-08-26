import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import Navbar from "../components/Navbar"; // Import the Navbar

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await api.get("/api/users/profile");
        setUser(res.data);
        if (
          !res.data.profile ||
          res.data.profile.academicInterests.length === 0
        ) {
          navigate("/onboarding");
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleScan = async (data) => {
    if (data) {
      setShowScanner(false);
      const token = localStorage.getItem("token");
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      try {
        const res = await api.post("/api/attendance/mark", {
          qrToken: data.text,
        });
        alert(res.data.message);
      } catch (error) {
        alert(error.response.data.message || "Failed to mark attendance.");
      }
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to your Dashboard, {user.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Section */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attendance</h2>
            <p className="text-gray-600 mb-4">
              Scan the QR code in your classroom to mark your attendance for the
              day.
            </p>
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              {showScanner ? "Close Scanner" : "Scan Attendance QR Code"}
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

          {/* Activities Section */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Recommended Activities
            </h2>
            <div className="text-gray-600">
              <p>
                Personalized activities based on your interests and free periods
                will appear here soon!
              </p>
              {/* We will build the logic to fetch and display activities here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

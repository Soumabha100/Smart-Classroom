import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code"; // ✅ 1. Use the new library's import
import Sidebar from "../components/Sidebar";
import AttendanceChart from "../components/AttendanceChart";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export default function TeacherDashboard() {
  const [qrToken, setQrToken] = useState(null);
  const [classId, setClassId] = useState("CSE-501");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveAttendance, setLiveAttendance] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Teacher connected to WebSocket server!");
    });

    socket.on("new_attendance", (newLog) => {
      console.log("New attendance record received:", newLog);
      setLiveAttendance((prevLog) => [newLog, ...prevLog]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const generateQR = async () => {
    setIsLoading(true);
    setError("");
    setQrToken(null);
    const token = localStorage.getItem("token");

    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.post("/api/attendance/generate-qr", { classId });
      setQrToken(res.data.qrToken);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-100">
      <Sidebar />
      <main className="flex-grow ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Teacher Dashboard
          </h1>
          <p className="text-slate-600">
            Monitor live attendance and view analytics.
          </p>
        </header>

        <div className="mb-8">
          <AttendanceChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              Generate Code
            </h2>
            <div className="mb-4">
              <label
                htmlFor="classId"
                className="block text-sm font-medium text-gray-700"
              >
                Class ID
              </label>
              <input
                type="text"
                id="classId"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={generateQR}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300"
            >
              {isLoading ? "Generating..." : "Generate Attendance QR Code"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
            {qrToken && (
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  Scan this code to mark attendance
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  This code will expire in 30 seconds.
                </p>
                <div className="p-4 bg-white inline-block border rounded-lg">
                  {/* ✅ 2. Use the new component's simple syntax */}
                  <QRCode value={qrToken} size={256} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              Live Attendance Feed
            </h2>
            <div className="space-y-3 h-96 overflow-y-auto">
              {liveAttendance.length > 0 ? (
                liveAttendance.map((log, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold">{log.student_name}</p>
                      <p className="text-sm text-slate-500">{log.timestamp}</p>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {log.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center mt-10">
                  Waiting for students to check in...
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

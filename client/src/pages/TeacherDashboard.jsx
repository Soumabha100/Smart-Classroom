import React, { useState, useEffect } from "react";
import QRCodeWrapper from "../components/QRCodeWrapper";
import AttendanceChart from "../components/AttendanceChart";
import io from "socket.io-client";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/apiService"; // API instance for backend calls

import ChatBox from "./ChatBox.jsx"; // Assuming ChatBox.jsx is in src/pages
import ClassesManager from "../components/ClassMannager.jsx"; // Ensure this path and filename exist exactly
import AssingmentMannager from "../components/AssingmentMannager.jsx"; // Confirm file and path
import Hodfeed from "../components/Hodfeed.jsx"; // Confirm case-sensitive spelling and path

// Dynamically determine secure WebSocket URL
const isSecure = window.location.protocol === "https:";
const SOCKET_URL = `${isSecure ? "wss" : "ws"}://${window.location.hostname}:5001`;

const QR_CODE_VALIDITY_SECONDS = 120;

export default function TeacherDashboard() {
  const [qrToken, setQrToken] = useState(null);
  const [classId, setClassId] = useState("CSE-501");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveAttendance, setLiveAttendance] = useState([]);
  const [countdown, setCountdown] = useState(QR_CODE_VALIDITY_SECONDS);

  useEffect(() => {
    if (!qrToken) return;
    setCountdown(QR_CODE_VALIDITY_SECONDS);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrToken]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("connect", () => console.log("Teacher connected to WebSocket!"));
    socket.on("new_attendance", (newLog) => {
      setLiveAttendance((prevLog) => [newLog, ...prevLog]);
    });
    return () => socket.disconnect();
  }, []);

  const generateQR = async () => {
    setIsLoading(true);
    setError("");
    setQrToken(null);

    try {
      const res = await api.post("/attendance/generate-qr", { classId });
      setQrToken(res.data.qrToken);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Teacher Dashboard</h1>
        <p className="text-slate-600">Monitor live attendance and view analytics.</p>
      </header>

      <div className="mb-8">
        <AttendanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Generate Code</h2>
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
              <p className="text-lg font-bold text-red-600 my-2">
                Expires in: {countdown}s
              </p>
              <div className="p-4 bg-white inline-block border rounded-lg">
                <QRCodeWrapper value={qrToken} size={256} />
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
                  <span className="text-green-600 font-semibold">{log.status}</span>
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

      {/* ClassesManager, AssignmentsManager, HODFeed and ChatBox sections */}
      <div className="mt-10 space-y-8">
        <ClassesManager />
        <AssingmentMannager classIdProp={classId} />
        <Hodfeed />
        <ChatBox user="Teacher" />
      </div>
    </DashboardLayout>
  );
}

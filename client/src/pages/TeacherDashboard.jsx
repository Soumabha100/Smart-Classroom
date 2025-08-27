import React, { useState } from "react";
import axios from "axios";
import * as QRCode from 'qrcode.react';
import Sidebar from "../components/Sidebar";

export default function TeacherDashboard() {
  const [qrToken, setQrToken] = useState(null);
  const [classId, setClassId] = useState("CSE-501"); // Example Class ID
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      // The QR code will automatically expire after 30 seconds (as set in the backend)
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
            Generate a QR code to take attendance for your class.
          </p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
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
              <div className="p-4 inline-block border rounded-lg">
                <QRCode value={qrToken} size={256} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

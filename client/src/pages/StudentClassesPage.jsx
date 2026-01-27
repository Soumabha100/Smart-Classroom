import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QrScanner } from "@yudiel/react-qr-scanner";
import {
  QrCode,
  BookOpen,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  CameraOff,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { getStudentClasses } from "../api/apiService.js";
import api from "../api/apiService.js";

export default function StudentClassesPage() {
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scannerError, setScannerError] = useState(null);

  const scanLock = useRef(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const { data } = await getStudentClasses();
        setClasses(data);
        if (location.state?.openScanner && data.length > 0) {
          openScannerForClass(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, [location.state]);

  const openScannerForClass = (classInfo) => {
    setSelectedClass(classInfo);
    setScannerError(null);
    scanLock.current = false;
    setShowScanner(true);
  };

  const handleScan = async (result) => {

    if (!result || !selectedClass || scanLock.current) return;

    
    scanLock.current = true;

    // In v1, 'result' is the string QR code itself
    const qrToken = result;

    setShowScanner(false);
    console.log(`[FRONTEND] Scanned QR Token: ${qrToken}`);

    try {
      const res = await api.post("/attendance/mark", {
        qrToken: qrToken,
        classId: selectedClass._id,
      });
      setScanResult({ type: "success", message: res.data.message });
    } catch (error) {
      setScanResult({
        type: "error",
        message: error.response?.data?.message || "Scan failed.",
      });
    } finally {
      setTimeout(() => setScanResult(null), 5000);
    }
  };

  const handleError = (error) => {
    // Ignore minor camera errors to prevent UI flickering
    if (error?.message?.includes("No video input devices found")) {
      setScannerError("Camera not found");
    }
  };

  return (
    <DashboardLayout>
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl"
            >
              <button
                onClick={() => setShowScanner(false)}
                className="absolute -top-3 -right-3 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110 z-10"
              >
                <X size={20} />
              </button>

              <div className="w-full overflow-hidden rounded-lg aspect-square bg-slate-900 flex items-center justify-center relative">
                {scannerError ? (
                  <div className="text-center text-red-400 p-4">
                    <CameraOff size={48} className="mx-auto" />
                    <p className="mt-4 font-semibold">Camera Error</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {scannerError}
                    </p>
                  </div>
                ) : (
                  <QrScanner
                    onDecode={handleScan}
                    onError={handleError}
                    containerStyle={{ width: "100%", height: "100%" }}
                    videoStyle={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    hideCount={true} // Optimization: Hide scan count overlay
                    scanDelay={500} // Optimization: Slow down scanning interval
                  />
                )}
              </div>

              <p className="text-center text-slate-400 mt-4 text-sm font-semibold">
                {scannerError
                  ? "Please try again."
                  : `Scanning for ${selectedClass?.name || "class"}...`}
              </p>
            </motion.div>
          </motion.div>
        )}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 p-4 rounded-lg flex items-center gap-3 text-sm font-semibold shadow-2xl z-50 ${
              scanResult.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {scanResult.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {scanResult.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mb-4"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            My Enrolled Classes
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Select a class to view details or scan for attendance.
          </p>
        </motion.div>

        {isLoading ? (
          <p className="text-slate-500 dark:text-slate-400">
            Loading your classes...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.length > 0 ? (
              classes.map((c, index) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-indigo-500/50 dark:hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {c.name}
                      </h2>
                      <BookOpen className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold mb-2">
                      {c.subject}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Taught by: {c.teacher.name}
                    </p>
                  </div>
                  <button
                    onClick={() => openScannerForClass(c)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Scan Attendance</span>
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <BookOpen size={48} className="mx-auto text-slate-400" />
                <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">
                  No classes joined yet
                </h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Once you are added to a class, it will appear here.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

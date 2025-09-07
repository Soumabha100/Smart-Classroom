import React, { useEffect, useState } from "react";
import FileCard from "../components/Drive/FileCard";
import UploadModal from "../components/Drive/UploadModal";
import * as fileService from "../services/fileService";
import { motion, AnimatePresence } from "framer-motion";

export default function DrivePage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // New state for preview

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await fileService.getFiles();
        setFiles(data || []);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to load files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  async function handleUpload(file) {
    try {
      const uploaded = await fileService.uploadFile(file);
      setFiles((prev) => [uploaded, ...prev]);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file");
    }
  }

  async function handleDelete(id) {
    try {
      await fileService.deleteFile(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
          🚀 Drive — Study Materials
        </h2>
        <UploadModal onUpload={handleUpload} />
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-300 animate-pulse">Loading files...</p>}

      {/* Error State */}
      {error && (
        <p className="text-red-300 bg-red-800/40 p-3 rounded-lg shadow-sm">
          {error}
        </p>
      )}

      {/* File List */}
      {!loading && files.length === 0 && !error && (
        <p className="text-gray-400 italic">
          No files uploaded yet. Use the upload button to add study materials.
        </p>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {files.map((f, index) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="transform transition"
            >
              <FileCard
                file={f}
                onDelete={handleDelete}
                onPreview={(file) => setPreviewFile(file)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-3xl bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 text-white relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewFile(null)}
                className="absolute top-4 right-4 px-3 py-1 bg-red-500 rounded text-white hover:bg-red-600 transition"
              >
                Close
              </button>

              {/* Render content based on type */}
              {previewFile.type === "pdf" && (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[80vh] rounded"
                  title={previewFile.name}
                ></iframe>
              )}

              {previewFile.type === "image" && (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="w-full h-auto max-h-[80vh] object-contain rounded"
                />
              )}

              {previewFile.type === "video" && (
                <video
                  src={previewFile.url}
                  controls
                  className="w-full h-auto max-h-[80vh] rounded"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

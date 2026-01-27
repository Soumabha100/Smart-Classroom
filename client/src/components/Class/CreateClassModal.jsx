import React, { useState } from "react";
import { X, Loader2, Presentation, BookCopy } from "lucide-react";
import InputWithIcon from "../ui/InputWithIcon";

const CreateClassModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) {
      setError("Class name and subject are required.");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      await onSave({ name, subject });
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 mx-4 bg-white border rounded-lg shadow-xl dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between pb-4 mb-4 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create a New Class
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Class Name
            </label>
            <InputWithIcon
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Advanced Physics"
              icon={<Presentation />}
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Subject
            </label>
            <InputWithIcon
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Physics"
              icon={<BookCopy />}
            />
          </div>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center w-32 gap-2 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;

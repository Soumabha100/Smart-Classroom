import React, { useState } from "react";
import { X, LoaderCircle, CheckCircle } from "lucide-react";
import { updateUserProfile } from "../../api/apiService";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
  });

  const [saveState, setSaveState] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name field cannot be empty.");
      return;
    }

    const hasChanged =
      formData.name !== user.name ||
      formData.phone !== (user.phone || "") ||
      formData.bio !== (user.bio || "");
    if (!hasChanged) {
      setError("No changes have been made.");
      return;
    }

    setSaveState("saving");
    try {
      const response = await updateUserProfile(formData);
      onSave(response.user);
      setSaveState("success");

      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      setSaveState("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 mx-4 bg-white border rounded-lg shadow-xl dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between pb-4 mb-4 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Your Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <img
              src={user.profilePicture || `/assets/default_avatar.png`}
              alt="Profile"
              className="w-24 h-24 mx-auto mb-2 rounded-full object-cover"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full input-style"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full input-style"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full input-style"
            ></textarea>
          </div>
          {error && (
            <p className="text-sm text-center text-yellow-500">{error}</p>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saveState === "saving"}
              className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveState !== "idle"}
              className="inline-flex items-center justify-center w-36 gap-2 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-75"
            >
              {saveState === "saving" && (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              )}
              {saveState === "success" && (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Success!
                </>
              )}
              {saveState === "idle" && "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

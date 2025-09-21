import React, { useState } from "react";
import { X } from "lucide-react";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    profilePicture: user.profilePicture || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // Basic file handling, you might want a more robust solution
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would call an API to update the user profile
    // For now, we simulate it by calling the onSave prop
    onSave({ ...user, ...formData });
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
              src={
                formData.profilePicture ||
                `https://api.multiavatar.com/${formData.name}.png`
              }
              alt="Profile Preview"
              className="w-24 h-24 mx-auto mb-2 rounded-full"
            />
            <input
              type="file"
              id="profilePicture"
              onChange={handleFileChange}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
              className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

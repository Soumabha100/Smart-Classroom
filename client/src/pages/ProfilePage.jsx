import React, { useState, useEffect } from "react";
import { Mail, Phone, User, Edit, Save } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { getUserProfile, updateUserProfile } from "../api/apiService"; // Assuming you have these API functions

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Replace with your actual API call to get the user's profile
        const userProfile = await getUserProfile();
        setUser(userProfile);
        setFormData({
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone || "",
          bio: userProfile.bio || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle error (e.g., show a toast notification)
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API call to update the user's profile
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      // Optionally, show a success message
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Handle error
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-gray-500">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="/images/hero-background.jpg" // Replace with a dynamic cover photo
              alt="Cover"
            />
            <div className="absolute top-24 left-1/2 -translate-x-1/2">
              <img
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} // Replace with user's avatar
                alt="Profile"
              />
            </div>
          </div>

          <div className="p-8 pt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user.role}
            </p>
          </div>

          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Profile Information
              </h3>
              <button
                onClick={handleEditToggle}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled // Usually, email is not editable
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <p className="ml-4 text-gray-800 dark:text-gray-200">
                    {user.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <p className="ml-4 text-gray-800 dark:text-gray-200">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <p className="ml-4 text-gray-800 dark:text-gray-200">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Bio
                  </h4>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {user.bio || "No bio available."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

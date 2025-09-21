import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  User,
  Mail,
  Phone,
  Edit,
  Award,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

import EditProfileModal from "../components/Profile/EditProfileModal";
import StudentProfileDetails from "../components/Profile/StudentProfileDetails";
import TeacherProfileDetails from "../components/Profile/TeacherProfileDetails";
import AdminProfileDetails from "../components/Profile/AdminProfileDetails";

const RoleBadge = ({ role }) => {
  const roleStyles = {
    student: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    teacher:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    admin:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  };
  const roleIcons = {
    student: <Award className="w-4 h-4" />,
    teacher: <Briefcase className="w-4 h-4" />,
    admin: <ShieldCheck className="w-4 h-4" />,
  };
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${roleStyles[role]}`}
    >
      {roleIcons[role]}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </div>
  );
};

const ProfilePage = () => {
  // This will now correctly receive the `updateUser` function
  const { user, updateUser } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const renderRoleSpecificDetails = () => {
    switch (user.role) {
      case "student":
        return <StudentProfileDetails user={user} />;
      case "teacher":
        return <TeacherProfileDetails user={user} />;
      case "admin":
        return <AdminProfileDetails user={user} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="p-6 text-center bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <img
                  src={user.profilePicture || "/assets/default_avatar.png"}
                  alt="Profile"
                  className="w-32 h-32 mx-auto mb-4 object-cover rounded-full ring-4 ring-indigo-500/50"
                />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="my-3">
                  <RoleBadge role={user.role} />
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {user.bio || "No bio available."}
                </p>
                <hr className="my-6 border-slate-200 dark:border-slate-700" />
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {user.phone || "Not provided"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 mt-8 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-8">{renderRoleSpecificDetails()}</div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedUserData) => {
            // This will now work perfectly.
            updateUser(updatedUserData);
            setEditModalOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ProfilePage;

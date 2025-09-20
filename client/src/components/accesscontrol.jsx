import React, { useState } from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const initialPermissions = [
  { id: 1, role: "Admin", canManage: true },
  { id: 2, role: "Teacher", canManage: true },
  { id: 3, role: "Student", canManage: false },
  { id: 4, role: "Parent", canManage: false },
];

export default function AccessControl() {
  const [permissions, setPermissions] = useState(initialPermissions);

  const togglePermission = (id) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, canManage: !perm.canManage } : perm
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 rounded-2xl shadow-xl 
                 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 
                 dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]"
    >
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Access Control
      </h2>
      <ul className="space-y-3">
        {permissions.map((perm, index) => (
          <motion.li
            key={perm.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-3 rounded-xl shadow-md cursor-pointer
              ${index % 2 === 0 ? "bg-slate-50 dark:bg-slate-800" : "bg-indigo-50 dark:bg-slate-700"}`}
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-indigo-500" />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {perm.role}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => togglePermission(perm.id)}
              className={`px-3 py-1 text-sm rounded-lg shadow-sm transition-colors duration-300 ${
                perm.canManage
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {perm.canManage ? "Allowed" : "Restricted"}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
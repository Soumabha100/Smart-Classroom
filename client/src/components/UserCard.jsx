// client/src/components/UserCard.jsx
import React, { useState, useEffect } from "react";
import { getUserCount } from "../api/apiService";
import { Shield, User, GraduationCap, Users, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const ICONS = {
  admin: {
    Icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/50",
  },
  teacher: {
    Icon: User,
    color: "text-sky-500",
    bg: "bg-sky-100 dark:bg-sky-900/50",
  },
  student: {
    Icon: GraduationCap,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/50",
  },
  parent: {
    Icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
  },
};

const UserCard = ({ type }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      try {
        const res = await getUserCount(type);
        setCount(res.data.count);
      } catch (err) {
        console.error(`Failed to fetch ${type} count`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, [type]);

  const { Icon, color, bg } = ICONS[type];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="flex items-center p-5 bg-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:bg-slate-800/50 gap-4"
    >
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        {loading ? (
          <LoaderCircle className="w-6 h-6 animate-spin text-slate-400" />
        ) : (
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {count}
          </p>
        )}
        <p className="capitalize text-sm text-slate-500 dark:text-slate-400 font-medium">
          Total {type}s
        </p>
      </div>
    </motion.div>
  );
};

export default UserCard;

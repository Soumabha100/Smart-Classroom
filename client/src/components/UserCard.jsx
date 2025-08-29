import React, { useState, useEffect } from "react";
import { getUserCount } from "../api/apiService";

// Icon mapping for different roles
const ICONS = {
  admin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-indigo-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z"
      />
    </svg>
  ),
  teacher: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-sky-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7"
      />
    </svg>
  ),
  student: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-amber-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  parent: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-emerald-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.04-2.72a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.04-2.72a3 3 0 00-5.356-1.857M12 21a3 3 0 00-3-3m6 0a3 3 0 00-3 3M12 3v6l-2-2m4 0l-2 2"
      />
    </svg>
  ),
};

const UserCard = ({ type }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="bg-slate-100 p-4 rounded-xl">{ICONS[type]}</div>
      <div>
        <p className="text-3xl font-bold text-slate-800">
          {loading ? "..." : count}
        </p>
        <p className="capitalize text-slate-500 font-medium">{type}s</p>
      </div>
    </div>
  );
};

export default UserCard;

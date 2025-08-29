import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserCard = ({ type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/users/count?role=${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCount(res.data.count);
      } catch (err) {
        console.error(`Failed to fetch ${type} count`, err);
      }
    };
    fetchCount();
  }, [type]);

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
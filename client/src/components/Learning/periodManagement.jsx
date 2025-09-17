import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PeriodManagement() {
  // 1️⃣ Load periods from localStorage or default
  const storedPeriods = JSON.parse(localStorage.getItem("periods")) || [
    { name: "Math", time: "09:00 - 10:00" },
    { name: "Physics", time: "10:15 - 11:15" },
    { name: "Chemistry", time: "11:30 - 12:30" },
  ];

  const [periods, setPeriods] = useState(storedPeriods);
  const [newSubject, setNewSubject] = useState("");
  const [newTime, setNewTime] = useState("");

  // 2️⃣ Save periods to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("periods", JSON.stringify(periods));
  }, [periods]);

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const checkConflict = (index, sortedPeriods) => {
    if (index === 0) return false;
    const prevEnd = timeToMinutes(sortedPeriods[index - 1].time.split(" - ")[1]);
    const currentStart = timeToMinutes(sortedPeriods[index].time.split(" - ")[0]);
    return currentStart < prevEnd;
  };

  const addPeriod = () => {
    if (!newSubject || !newTime) {
      alert("Please enter both subject and time!");
      return;
    }

    const updated = [...periods, { name: newSubject, time: newTime }];
    updated.sort(
      (a, b) => timeToMinutes(a.time.split(" - ")[0]) - timeToMinutes(b.time.split(" - ")[0])
    );

    setPeriods(updated);
    setNewSubject("");
    setNewTime("");
  };

  // 3️⃣ Delete a period by index
  const removePeriod = (index) => {
    const updated = [...periods];
    updated.splice(index, 1);
    setPeriods(updated);
  };

  // 4️⃣ Calculate free slots
  const freeSlots = [];
  for (let i = 0; i < periods.length - 1; i++) {
    const endCurrent = timeToMinutes(periods[i].time.split(" - ")[1]);
    const startNext = timeToMinutes(periods[i + 1].time.split(" - ")[0]);
    if (startNext > endCurrent)
      freeSlots.push(`${periods[i].time.split(" - ")[1]} - ${periods[i + 1].time.split(" - ")[0]}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-pink-200 via-pink-300 to-pink-100 text-gray-800 p-6 rounded-xl shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Free Period Management System With Smart Algorithm
      </h2>

      {/* Period List */}
      <ul className="space-y-3 mb-4">
        {periods.map((period, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-3 rounded-lg flex justify-between items-center ${
              checkConflict(index, periods)
                ? "bg-red-300 hover:bg-red-200"
                : "bg-pink-400 hover:bg-pink-300"
            }`}
          >
            <div className="flex-1 flex justify-between">
              <span>{period.name}</span>
              <span>{period.time}</span>
            </div>
            <button
              onClick={() => removePeriod(index)}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Remove
            </button>
          </motion.li>
        ))}
      </ul>

      {/* Free Slots */}
      {freeSlots.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-center text-green-600">Free Slots</h3>
          <ul className="space-y-1 text-center">
            {freeSlots.map((slot, idx) => (
              <li key={idx} className="bg-pink-300 p-2 rounded-lg">
                {slot}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Period Form */}
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="p-2 rounded-lg text-gray-800 flex-1"
        />
        <input
          type="text"
          placeholder="Time (e.g., 13:00 - 14:00)"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="p-2 rounded-lg text-gray-800 flex-1"
        />
        <button
          onClick={addPeriod}
          className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg"
        >
          Add Period
        </button>
      </div>
    </motion.div>
  );
}



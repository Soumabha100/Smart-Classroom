import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [interests, setInterests] = useState("");
  const [goals, setGoals] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      // We'll create this API endpoint in the next step
      await api.post("/api/users/profile", {
        academicInterests: interests.split(",").map((item) => item.trim()),
        careerGoals: goals.split(",").map((item) => item.trim()),
      });
      navigate("/dashboard"); // Redirect to dashboard after setup
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Could not save your profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Set Up Your Profile
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Help us personalize your experience. Please enter your interests and
          goals, separated by commas.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Academic Interests
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              placeholder="e.g., AI, Web Development, Public Speaking"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Career Goals
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              placeholder="e.g., Software Developer, Data Scientist"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            type="submit"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
}

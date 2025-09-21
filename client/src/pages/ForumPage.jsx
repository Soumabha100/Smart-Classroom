import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { ArrowLeft } from "lucide-react";

import PostList from "../components/Forum/PostList";
import CreatePost from "../components/Forum/CreatePost";
import DashboardLayout from "../components/DashboardLayout";

const socket = io("http://localhost:5000");

const ForumPage = () => {
  const navigate = useNavigate();
  // State to track which section is expanded. 'discussions' is expanded by default.
  const [activeSection, setActiveSection] = useState("discussions");

  useEffect(() => {
    socket.on("post_update", (newPost) => {
      console.log("New post received, refresh to see update:", newPost);
    });
    return () => {
      socket.off("post_update");
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Doubt Forum
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Click on a panel to expand it and focus.
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
            {/* Left Column: Post List -> Dynamically changes size */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeSection === "discussions"
                  ? "lg:col-span-2"
                  : "lg:col-span-1"
              }`}
            >
              <PostList
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </div>

            {/* Right Column: Create Post -> Dynamically changes size */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeSection === "create" ? "lg:col-span-2" : "lg:col-span-1"
              }`}
            >
              <CreatePost
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ForumPage;

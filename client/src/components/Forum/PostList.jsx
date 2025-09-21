import React, { useEffect, useState } from "react";
import { getPosts } from "../../api/apiService"; // Make sure this path is correct
import { MessageSquareText } from "lucide-react";

const PostList = ({ activeSection, setActiveSection }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, [activeSection]); // Refetch posts if needed when section becomes active

  const isActive = activeSection === "discussions";

  return (
    <div
      onClick={() => setActiveSection("discussions")}
      className={`p-6 bg-white border rounded-lg shadow-sm cursor-pointer transition-all duration-300 dark:bg-slate-800 dark:border-slate-700 ${
        !isActive ? "opacity-60 hover:opacity-100" : "opacity-100"
      }`}
    >
      <h2 className="flex items-center gap-3 pb-4 mb-4 text-xl font-semibold border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
        <MessageSquareText className="w-6 h-6 text-indigo-500" />
        Recent Discussions
      </h2>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-4 transition-colors bg-slate-50 rounded-lg dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <h3 className="font-bold text-md text-slate-800 dark:text-white">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                by {post.author?.name || "Unknown"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No discussions yet. Start one!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostList;

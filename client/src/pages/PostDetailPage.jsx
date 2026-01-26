import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import io from "socket.io-client";

import { getPostById } from "../api/apiService";
import DashboardLayout from "../components/DashboardLayout";
import CreateComment from "../components/Forum/CreateComment";
import CommentList from "../components/Forum/CommentList";

const socket = io("http://localhost:5000");

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const response = await getPostById(postId);
      setPost(response.data);
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();

    // Listen for new comments on this specific post
    const handleCommentUpdate = (newComment) => {
      if (newComment.post === postId) {
        // Add the new comment to the state in real-time
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, newComment],
        }));
      }
    };

    socket.on("comment_update", handleCommentUpdate);

    return () => {
      socket.off("comment_update", handleCommentUpdate);
    };
  }, [postId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500 dark:text-slate-400">Loading post...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Post not found.</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/forum")}
              className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              aria-label="Back to forum"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Discussion
            </h1>
          </div>

          {/* Post Content */}
          <div className="p-6 mb-8 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              {post.title}
            </h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Posted by {post.author?.name || "Anonymous"} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Create Comment Form */}
          <div className="mb-8">
            <CreateComment postId={postId} onCommentPosted={fetchPost} />
          </div>

          {/* Comments Section */}
          <div>
            <CommentList comments={post.comments || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostDetailPage;

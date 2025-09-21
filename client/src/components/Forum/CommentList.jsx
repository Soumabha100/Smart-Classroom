import React from "react";

const CommentList = ({ comments }) => {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h3 className="pb-4 mb-4 text-xl font-semibold border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
        Comments ({comments.length})
      </h3>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 bg-slate-50 rounded-md dark:bg-slate-700/50"
            >
              <p className="mb-1 text-slate-800 dark:text-slate-200">
                {comment.text}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                - {comment.author?.name || "Anonymous"} on{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentList;

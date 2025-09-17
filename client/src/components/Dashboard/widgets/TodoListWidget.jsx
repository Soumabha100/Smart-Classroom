import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TodoListWidget = ({ data }) => {
  // Safely default to an empty array if data.tasks is missing
  const initialTasks = Array.isArray(data.tasks) ? data.tasks : [];
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // If there's no data or title, don't render anything.
  if (!data || !data.title) {
    return null; // Or return a placeholder
  }

  return (
    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        {data.title}
      </h3>
      <div className="space-y-3">
        {/* The critical fix: Check if 'tasks' is an array before mapping */}
        {tasks.length > 0 ? (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="text-green-500 h-6 w-6 flex-shrink-0" />
                ) : (
                  <Circle className="text-slate-400 dark:text-slate-500 h-6 w-6 flex-shrink-0" />
                )}
                <span
                  className={`flex-grow ${
                    task.completed
                      ? "line-through text-slate-500 dark:text-slate-400"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {task.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          // Show a friendly message if there are no tasks
          <div className="text-center py-4">
            <p className="text-slate-500 dark:text-slate-400">
              No tasks on your list right now!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoListWidget;

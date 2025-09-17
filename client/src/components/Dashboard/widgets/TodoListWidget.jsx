import React from 'react';

const TodoListWidget = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{data.title}</h3>
      <ul className="space-y-3">
        {data.tasks.map((task) => (
          <li key={task.id} className="flex items-center">
            <input
              type="checkbox"
              id={`task-${task.id}`}
              defaultChecked={task.completed}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={`task-${task.id}`} className="ml-3 block text-slate-700 dark:text-slate-300">
              {task.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListWidget;
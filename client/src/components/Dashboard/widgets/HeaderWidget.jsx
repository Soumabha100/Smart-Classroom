import React from 'react';

const HeaderWidget = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold">{data.title}</h2>
      <p className="mt-1 text-blue-100">{data.subtitle}</p>
    </div>
  );
};

export default HeaderWidget;
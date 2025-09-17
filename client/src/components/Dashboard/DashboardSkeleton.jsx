import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mt-2"></div>
    </div>
);

const DashboardSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 h-28 bg-blue-200 dark:bg-blue-900/50 rounded-lg animate-pulse"></div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
};

export default DashboardSkeleton;
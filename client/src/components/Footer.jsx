import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {currentYear} Smart Classroom. All Rights Reserved.</p>
        <p className="text-gray-400 text-sm mt-1">Made for SIH 2025</p>
      </div>
    </footer>
  );
}
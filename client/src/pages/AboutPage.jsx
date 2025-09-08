import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import images
import aboutImage from "https://i.ibb.co/ZRrxXZJ2/classroom.jpg";
import studentsImage from "https://i.ibb.co/ccZgQZ2X/class2.jpg";
import teachersImage from "https://i.ibb.co/twTnjJvb/class1.jpg";
import schoolsImage from "https://i.ibb.co/0VyzzCP1/facility1.jpg";

// Animated tab content wrapper
const TabContent = ({ children }) => (
  <motion.div
    key="tab"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="space-y-6"
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    {
      id: "about",
      title: "About Us",
      icon: "🏢",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-indigo-700 mb-4">
              Who We Are
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are a team of passionate innovators dedicated to transforming
              education through technology. Our{" "}
              <b className="text-indigo-700">Smart Classroom</b> project aims to
              create a seamless, efficient, and engaging learning environment
              for students and teachers alike.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={aboutImage}
              alt="Modern classroom"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      ),
    },
    {
      id: "students",
      title: "Students",
      icon: "🎓",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-blue-600 mb-4">
              Student Impact
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our solutions have already impacted over{" "}
              <b className="text-blue-600">5,000+ students</b> by making
              education more interactive, accessible, and personalized. With
              smart tools, students enjoy learning and perform better
              academically.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={studentsImage}
              alt="Students learning"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      ),
    },
    {
      id: "teachers",
      title: "Teachers",
      icon: "👩‍🏫",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-orange-600 mb-4">
              Teacher Empowerment
            </h3>
            <p className="text-gray-700 leading-relaxed">
              More than <b className="text-orange-600">300+ teachers</b> have
              been empowered with smart classroom tools. They can automate
              attendance, track performance, and spend more time doing what they
              love — <b>teaching</b>.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={teachersImage}
              alt="Teacher presenting"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      ),
    },
    {
      id: "schools",
      title: "Schools",
      icon: "🏫",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-purple-600 mb-4">
              Schools Connected
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We are proud to have connected{" "}
              <b className="text-purple-600">50+ schools</b>, creating a network
              of smart classrooms that share innovation and best practices.
              Together, we are shaping the{" "}
              <b className="text-purple-600">future of education</b>.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={schoolsImage}
              alt="School library"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-20 px-6 text-white text-center rounded-b-3xl shadow-lg"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Our Mission
          </h1>
          <p className="mt-4 text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Learn more about our vision, our achievements, and the impact we are
            making in the world of education.
          </p>
        </motion.section>

        {/* Tab Section */}
        <section className="max-w-6xl mx-auto py-16 px-6">
          {/* Tab Bar */}
          <div className="flex justify-center border-b border-gray-200 mb-12 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-all duration-300 ease-in-out border-b-4 rounded-t-lg ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                    : "border-transparent text-gray-500 hover:text-indigo-500 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[300px]">
            <AnimatePresence mode="wait">
              {tabs.map((tab) =>
                activeTab === tab.id ? (
                  <TabContent key={tab.id}>{tab.content}</TabContent>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

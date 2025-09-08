import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Data Configuration for Tabs ---
// This structure makes it easy to add, remove, or change tabs without touching the JSX.
const tabData = [
  {
    id: "about",
    title: "About Us",
    icon: "🏢",
    heading: "Who We Are",
    imageSrc: "https://i.ibb.co/ZRrxXZJ2/classroom.jpg",
    imageAlt: "A modern, well-lit classroom with technology",
    color: "indigo",
    content: (
      <>
        We are a team of passionate innovators dedicated to transforming
        education through technology. Our{" "}
        <b className="text-indigo-700">Smart Classroom</b> project aims to
        create a seamless, efficient, and engaging learning environment for
        students and teachers alike.
      </>
    ),
  },
  {
    id: "students",
    title: "Students",
    icon: "🎓",
    heading: "Student Impact",
    imageSrc: "https://i.ibb.co/ccZgQZ2X/class2.jpg",
    imageAlt: "Students collaborating on a project in a classroom",
    color: "blue",
    content: (
      <>
        Our solutions have already impacted over{" "}
        <b className="text-blue-600">5,000+ students</b> by making education
        more interactive, accessible, and personalized. With smart tools,
        students enjoy learning and perform better academically.
      </>
    ),
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: "👩‍🏫",
    heading: "Teacher Empowerment",
    imageSrc: "https://i.ibb.co/twTnjJvb/class1.jpg",
    imageAlt: "A teacher enthusiastically instructing a class",
    color: "orange",
    content: (
      <>
        More than <b className="text-orange-600">300+ teachers</b> have been
        empowered with smart classroom tools. They can automate attendance,
        track performance, and spend more time doing what they love —{" "}
        <b>teaching</b>.
      </>
    ),
  },
  {
    id: "schools",
    title: "Schools",
    icon: "🏫",
    heading: "Schools Connected",
    imageSrc: "https://i.ibb.co/0VyzzCP1/facility1.jpg",
    imageAlt: "A modern school library with shelves full of books",
    color: "purple",
    content: (
      <>
        We are proud to have connected{" "}
        <b className="text-purple-600">50+ schools</b>, creating a network of
        smart classrooms that share innovation and best practices. Together, we
        are shaping the <b className="text-purple-600">future of education</b>.
      </>
    ),
  },
];

// --- Reusable Animated Components ---

// Wrapper for the content of each tab to handle the fade/slide animation
const TabContent = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// A reusable component for the content layout within a tab
const ContentLayout = ({ heading, color, content, imageSrc, imageAlt }) => (
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h3 className={`text-3xl font-bold text-${color}-700 mb-4`}>{heading}</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {content}
      </p>
    </motion.div>
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex justify-center"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 max-h-80 w-auto"
      />
    </motion.div>
  </div>
);

// --- Main About Page Component ---

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState(tabData[0].id);

  // Preload images for a smoother user experience
  useEffect(() => {
    tabData.forEach((tab) => {
      const img = new Image();
      img.src = tab.imageSrc;
    });
  }, []);

  // useMemo ensures the active tab's data is only recalculated when activeTab changes
  const currentTab = useMemo(
    () => tabData.find((tab) => tab.id === activeTab),
    [activeTab]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-20 px-6 text-white text-center rounded-b-3xl shadow-lg"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Our Mission
          </h1>
          <p className="mt-4 text-lg md:text-xl text-purple-100 max-w-3xl mx-auto">
            To empower the next generation by creating intelligent, connected,
            and inspiring learning environments.
          </p>
        </motion.section>

        {/* Tab Section */}
        <section className="max-w-6xl mx-auto py-16 px-6">
          {/* Tab Buttons */}
          <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-12 flex-wrap">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-colors duration-300 ease-in-out border-b-4 -mb-px ${
                  activeTab === tab.id
                    ? `border-indigo-500 text-indigo-600 dark:text-indigo-400`
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 min-h-[350px] flex items-center">
            <AnimatePresence mode="wait">
              {currentTab && (
                <TabContent key={currentTab.id}>
                  <ContentLayout
                    heading={currentTab.heading}
                    color={currentTab.color}
                    content={currentTab.content}
                    imageSrc={currentTab.imageSrc}
                    imageAlt={currentTab.imageAlt}
                  />
                </TabContent>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

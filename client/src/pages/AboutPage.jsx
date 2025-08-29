import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import images from your assets folder
import aboutImage from "../assets/images/classroom.jpg";
import studentsImage from "../assets/images/class2.jpg";
import teachersImage from "../assets/images/class1.jpg";
import schoolsImage from "../assets/images/facility1.jpg";

// Helper component for animated tab content
const TabContent = ({ children }) => (
  <div className="animate-fadeIn">{children}</div>
);

// Main About Page Component
export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    {
      id: "about",
      title: "About Us",
      icon: "🏢",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-3xl font-bold text-indigo-700 mb-4">
              Who We Are
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are a team of passionate innovators dedicated to transforming
              education through technology. Our <b>Smart Classroom</b> project
              aims to create a seamless, efficient, and engaging learning
              environment for students and teachers alike.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={aboutImage}
              alt="Modern classroom"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ),
    },
    {
      id: "students",
      title: "Students",
      icon: "🎓",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-600 mb-4">
              Student Impact
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our solutions have already impacted over <b>5,000+ students</b> by
              making education more interactive, accessible, and personalized.
              With smart tools, students enjoy learning and perform better
              academically.
            </p>
          </div>
          <div>
            <img
              src={studentsImage}
              alt="Students learning"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ),
    },
    {
      id: "teachers",
      title: "Teachers",
      icon: "👩‍🏫",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-3xl font-bold text-orange-600 mb-4">
              Teacher Empowerment
            </h3>
            <p className="text-gray-700 leading-relaxed">
              More than <b>300+ teachers</b> have been empowered with smart
              classroom tools. They can automate attendance, track performance,
              and spend more time doing what they love — <b>teaching</b>.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={teachersImage}
              alt="Teacher presenting"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ),
    },
    {
      id: "schools",
      title: "Schools",
      icon: "🏫",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-purple-600 mb-4">
              Schools Connected
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We are proud to have connected <b>50+ schools</b>, creating a
              network of smart classrooms that share innovation and best
              practices. Together, we are shaping the <b>future of education</b>
              .
            </p>
          </div>
          <div>
            <img
              src={schoolsImage}
              alt="School library"
              className="rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-20">
        {" "}
        {/* Add padding to offset the fixed navbar */}
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-100 to-slate-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900">
              Our Mission
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Learn more about our vision, our achievements, and the impact we
              are making in the world of education.
            </p>
          </div>
        </section>
        {/* Tab Section */}
        <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Tab Bar */}
          <div className="flex justify-center border-b border-gray-200 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-base md:text-lg font-semibold transition-all duration-300 ease-in-out border-b-4 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-indigo-500 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[300px]">
            {tabs.map((tab) =>
              activeTab === tab.id ? (
                <TabContent key={tab.id}>{tab.content}</TabContent>
              ) : null
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import images from the assets folder
import heroImage from "../assets/images/home.jpg";
import facility1 from "../assets/images/facility1.jpg";
import facility2 from "../assets/images/facility2.jpg";
import facility3 from "../assets/images/facility3.jpg";
import facility4 from "../assets/images/facility4.jpg";
import facility5 from "../assets/images/facility5.jpg";
import facility6 from "../assets/images/facility6.jpg";
import class1 from "../assets/images/class1.jpg";
import class2 from "../assets/images/class2.jpg";
import class3 from "../assets/images/class3.jpg";

// Data for the new Features section
const features = [
  {
    icon: "✔️",
    title: "Automated Attendance",
    description:
      "Effortlessly mark attendance with QR codes, saving valuable class time.",
  },
  {
    icon: "🎯",
    title: "Personalized Activities",
    description:
      "Turn free periods into productive learning sessions with AI-powered recommendations.",
  },
  {
    icon: "📊",
    title: "Real-time Analytics",
    description:
      "Gain insights into student engagement and performance with our powerful dashboards.",
  },
];

const facilities = [
  { img: facility1, title: "Best Library" },
  { img: facility2, title: "Playground" },
  { img: facility3, title: "Healthy Food" },
  { img: facility4, title: "Activity Room" },
  { img: facility5, title: "Computer Lab" },
  { img: facility6, title: "Music Room" },
];

const classrooms = [
  { img: class1, title: "Interactive Learning" },
  { img: class2, title: "Real-time Collaboration" },
  { img: class3, title: "Data-Driven Insights" },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="bg-black/60 h-full w-full flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Empowering Education For A Brighter Future
            </h1>
            <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto">
              A single platform that combines AI tutoring, gamification, and
              classroom automation to create an interactive and efficient
              learning environment.
            </p>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4 text-slate-900">
            Why Choose Smart Classroom?
          </h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            Our aim is to make education more engaging, personalized, and
            efficient for both students and teachers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-lg shadow-md bg-slate-50">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classrooms Section */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4 text-slate-900">
            Explore Our Learning Environments
          </h2>
          <p className="text-slate-600 mb-12">
            State-of-the-art learning environments designed for modern
            education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classrooms.map((room, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform duration-300"
              >
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-bold text-slate-800">
                    {room.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4 text-slate-900">
            Our World-Class Facilities
          </h2>
          <p className="text-slate-600 mb-12">
            We provide cutting-edge resources to support every student's
            journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                style={{ backgroundImage: `url(${facility.img})` }}
                className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg group bg-cover bg-center"
              >
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-40">
                  <h3 className="text-white text-xl font-bold p-4 text-center">
                    {facility.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Call to Action Section */}
      <section className="bg-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Ready to Transform Your Classroom?
          </h2>
          <p className="mb-8 font-light text-blue-100">
            Join the growing community of educators and students who are
            embracing the future of learning. Get started for free today.
          </p>
          <Link
            to="/register"
            className="bg-white hover:bg-slate-100 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

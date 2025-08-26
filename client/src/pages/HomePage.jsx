import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ✅ 1. Import the image from its new location inside src.
import HeroBackgroundImage from '../assets/images/hero-background.jpg';

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

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[600px] w-full bg-cover bg-center flex items-center justify-center text-white"
        // ✅ 2. Use the imported variable. This is the most reliable method.
        style={{ backgroundImage: `url(${HeroBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 text-center p-8 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            The Future of Classroom Management is Here
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light">
            Seamless attendance, personalized learning, and powerful analytics,
            all in one platform.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
          >
            Join for Free
          </Link>
        </div>
      </section>

      {/* Other sections remain the same */}

      <Footer />
    </div>
  );
}

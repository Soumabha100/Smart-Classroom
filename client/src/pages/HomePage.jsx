import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

//  1. Import the image from its location inside the `src` folder.
import HeroBackgroundImage from "../assets/images/hero-background.jpg";

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

      <section className="relative h-[600px] w-full flex items-center justify-center text-white">
        {/* ✅ Using a standard <img> tag for the background */}
        <img
          src="/images/hero-background.jpg"
          alt="Background of a modern classroom"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        {/* This div creates the dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* This div holds the text content */}
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

      {/* Features Section and Call to Action... */}

      <Footer />
    </div>
  );
}

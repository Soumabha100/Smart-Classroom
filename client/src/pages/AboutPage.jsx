import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import aboutImage from "../assets/images/classroom.jpg"; // Main image for the about section
import heroImage from "../assets/images/home.jpg"; // Background for the header

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <Navbar />

      {/* Sub-Header Section */}
      <header
        className="h-64 w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="bg-black/60 h-full w-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            About Us
          </h1>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                The Best Smart Classroom Solution
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                A smart classroom integrates modern technology, like interactive
                displays, projectors, and educational software, to enhance
                teaching and student engagement. It transforms passive learning
                into an active, multimedia-rich experience, fostering a more
                dynamic and effective educational atmosphere.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                For teachers, it improves efficiency with tools for lesson
                preparation, automated grading, and attendance tracking. For
                students, it increases engagement through interactive content
                and personalized learning paths. Both gain from a more
                collaborative and resource-rich environment.
              </p>
              <a
                href="#features" // You can link this to your features section on the homepage later
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 inline-block"
              >
                Explore Features
              </a>
            </div>

            {/* Right Column: Image */}
            <div className="flex justify-center">
              <img
                src={aboutImage}
                alt="Students in a modern classroom"
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

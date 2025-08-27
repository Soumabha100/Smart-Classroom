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

const facilities = [
  { img: facility1, title: "Best Library" },
  { img: facility2, title: "Playground" },
  { img: facility3, title: "Healthy Food" },
  { img: facility4, title: "Activity Room" },
  { img: facility5, title: "Computer Lab" },
  { img: facility6, title: "Music Room" },
];

const classrooms = [
  { img: class1, title: "Smart Classroom A" },
  { img: class2, title: "Interactive Learning Hall" },
  { img: class3, title: "Collaborative Space" },
];

export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="bg-black/60 h-full w-full flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              EMPOWERING EDUCATION FOR A BRIGHTER FUTURE
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Transforming classrooms with innovative technology.
            </p>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Classrooms Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-2">
            Smart Classroom Management Software
          </h2>
          <p className="text-gray-600 mb-10">
            State-of-the-art learning environments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classrooms.map((room, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-2">Our Facilities</h2>
          <p className="text-gray-600 mb-10">
            We provide world-class facilities for our students.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                style={{ backgroundImage: `url(${facility.img})` }}
                className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg group bg-cover bg-center"
              >
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-40">
                  <h3 className="text-white text-2xl font-bold">
                    {facility.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import images
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

// Features
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

// Facilities
const facilities = [
  { img: facility1, title: "Best Library" },
  { img: facility2, title: "Playground" },
  { img: facility3, title: "Healthy Food" },
  { img: facility4, title: "Activity Room" },
  { img: facility5, title: "Computer Lab" },
  { img: facility6, title: "Music Room" },
];

// Classrooms
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
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
            >
              Empowering Education For A Brighter Future
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto"
            >
              A single platform that combines AI tutoring, gamification, and
              classroom automation to create an interactive and efficient
              learning environment.
            </motion.p>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform inline-flex items-center gap-2"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold mb-4 text-slate-900"
          >
            Why Choose Smart Classroom?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-700 mb-12 max-w-2xl mx-auto"
          >
            Our aim is to make education more engaging, personalized, and
            efficient for both students and teachers.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transform hover:-translate-y-2 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 text-center gap-8">
          {[
            { number: "500+", label: "Active Students" },
            { number: "50+", label: "Smart Classrooms" },
            { number: "100+", label: "Teachers Trained" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg shadow-md bg-blue-50 hover:scale-105 transition"
            >
              <h3 className="text-4xl font-extrabold text-blue-700">
                {stat.number}
              </h3>
              <p className="text-slate-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Classrooms Section */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold mb-4 text-slate-900"
          >
            Explore Our Learning Environments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 mb-12"
          >
            State-of-the-art learning environments designed for modern
            education.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classrooms.map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="rounded-lg overflow-hidden shadow-xl hover:-translate-y-2 transition-transform duration-300"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold mb-4 text-slate-900"
          >
            Our World-Class Facilities
          </motion.h2>
          <p className="text-slate-600 mb-12">
            We provide cutting-edge resources to support every student's
            journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                style={{ backgroundImage: `url(${facility.img})` }}
                className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg group bg-cover bg-center hover:scale-105 transition"
              >
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-opacity-40 transition">
                  <h3 className="text-white text-xl font-bold p-4 text-center">
                    {facility.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-extrabold mb-12 text-indigo-900"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "“The smart classroom system made attendance effortless and increased student engagement.”",
                author: "— Teacher A",
                border: "border-indigo-100 text-indigo-700",
              },
              {
                text: "“I love how I can collaborate with classmates in real-time.”",
                author: "— Student B",
                border: "border-purple-100 text-purple-700",
              },
              {
                text: "“The dashboard gives me real insights into student performance.”",
                author: "— Principal C",
                border: "border-pink-100 text-pink-700",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl shadow-lg bg-white border ${t.border} hover:shadow-xl transition`}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-slate-600 mb-4 italic">{t.text}</p>
                <h3 className="font-bold">{t.author}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold mb-4"
          >
            Ready to Transform Your Classroom?
          </motion.h2>
          <p className="mb-8 font-light text-blue-100">
            Join the growing community of educators and students who are
            embracing the future of learning. Get started for free today.
          </p>
          <div className="flex justify-center gap-6">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to="/register"
                className="bg-white hover:bg-slate-100 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg"
              >
                Enroll as Student
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to="/register"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg"
              >
                For Teachers
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ Improved Get in Touch Section */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="mb-8 text-slate-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Have questions or want to collaborate? We’d love to hear from you.
          </motion.p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-4 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="md:col-span-2 p-4 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:col-span-2 py-3 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Send Message
            </motion.button>
          </form>

          <div className="mt-10 flex justify-center space-x-6">
            <a href="#" className="hover:text-indigo-400">
              🌐 Website
            </a>
            <a href="mailto:info@example.com" className="hover:text-indigo-400">
              📧 Email
            </a>
            <a href="#" className="hover:text-indigo-400">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

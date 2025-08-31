import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bot, QrCode, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GetInTouch from "../components/GetInTouch";

// --- Configuration for Dynamic Elements ---
const dynamicTexts = [
  "Empowering Education.",
  "Automating Attendance.",
  "Personalizing Learning.",
  "Unlocking Potential.",
];

const dynamicBackgrounds = [
  "/images/Dark-Abstract.jpg",
  "/images/Student-Collaborating.jpg",
  "/images/Software-2.jpg",
  "/images/Abstract-Background.jpg",
];

const facilities = [
  { img: "/images/facility1.jpg", title: "State-of-the-Art Library" },
  { img: "/images/facility2.jpg", title: "Advanced Computer Labs" },
  { img: "/images/facility3.jpg", title: "Creative & AV Rooms" },
  { img: "/images/facility4.jpg", title: "Collaborative Study Zones" },
  { img: "/images/facility5.jpg", title: "Robotics & Tech Hub" },
  { img: "/images/facility6.jpg", title: "Outdoor Learning Spaces" },
  { img: "/images/facility1.jpg", title: "State-of-the-Art Library" },
  { img: "/images/facility2.jpg", title: "Advanced Computer Labs" },
];

const classrooms = [
  { img: "/images/class1.jpg", title: "Interactive Learning" },
  { img: "/images/class2.jpg", title: "Real-time Collaboration" },
  { img: "/images/class3.jpg", title: "Data-Driven Insights" },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length);
    }, 4000); // This now controls BOTH text and image changes

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-slate-900 text-slate-100 font-sans">
      <Navbar />

      {/* ✨ FIXED: Dynamic Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={index}
            src={dynamicBackgrounds[index]}
            alt="Dynamic Background"
            className="absolute top-0 left-0 w-full h-full object-cover" // ✨ FIX: Use object-cover
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-center p-8 max-w-5xl z-10">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight text-white h-24 md:h-36 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="block"
              >
                {dynamicTexts[index]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl mb-8 font-light max-w-3xl mx-auto text-slate-300"
          >
            A single platform combining AI, gamification, and classroom
            automation to create an interactive and efficient learning
            environment.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          >
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              Join the Future
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- ALL OTHER SECTIONS INTEGRATED BELOW --- */}
      {/* Features Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold mb-4 text-white"
          >
            An All-In-One Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 mb-16 max-w-2xl mx-auto"
          >
            Our platform is engineered to solve the core challenges of modern
            education, empowering both educators and learners.
          </motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <QrCode size={28} />,
                title: "Automated Attendance",
                description:
                  "Effortlessly mark attendance with QR codes, saving valuable class time.",
              },
              {
                icon: <Bot size={28} />,
                title: "Personalized Activities",
                description:
                  "Turn free periods into productive learning with AI-powered recommendations.",
              },
              {
                icon: <BarChart size={28} />,
                title: "Real-time Analytics",
                description:
                  "Gain deep insights into student engagement and performance dashboards.",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 shadow-lg text-left transform transition-all hover:-translate-y-2 hover:border-blue-500/50"
              >
                <div className="text-blue-400 bg-slate-700 p-3 rounded-lg inline-block mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800/50 py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 text-center gap-8"
        >
          {[
            { number: "500+", label: "Active Students" },
            { number: "50+", label: "Smart Classrooms" },
            { number: "100+", label: "Teachers Trained" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="p-6"
            >
              <h3 className="text-5xl font-extrabold text-blue-400">
                {stat.number}
              </h3>
              <p className="text-slate-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Classrooms Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold mb-4 text-white"
          >
            Explore Our Learning Environments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 mb-16 max-w-2xl mx-auto"
          >
            State-of-the-art learning environments designed for modern
            education.
          </motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {classrooms.map((room) => (
              <motion.div
                key={room.title}
                variants={itemVariants}
                className="rounded-2xl overflow-hidden shadow-xl group transform transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-2"
              >
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="p-4 bg-slate-800">
                  <h3 className="text-lg font-bold text-white">{room.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Facilities Carousel Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            World-Class Facilities
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            We provide cutting-edge resources to support every student's
            journey.
          </p>
          <div className="relative scroller">
            <div className="flex gap-4 animate-scroll">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="relative h-64 w-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl group"
                >
                  <img
                    src={facility.img}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-bold">
                      {facility.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-12 text-white"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Loved by Educators and Students
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                text: "“The smart classroom system made attendance effortless and dramatically increased student engagement.”",
                author: "— Prof. Anjali Sharma",
              },
              {
                text: "“I love how I can collaborate with classmates in real-time and get instant feedback on my work.”",
                author: "— Rohan Patel, Student",
              },
              {
                text: "“The dashboard gives me real, actionable insights into student performance across the entire institution.”",
                author: "— Mr. Singh, Principal",
              },
            ].map((t) => (
              <motion.div
                key={t.author}
                variants={itemVariants}
                className="p-8 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg"
              >
                <p className="text-slate-300 mb-6 italic">"{t.text}"</p>
                <h3 className="font-bold text-blue-400">{t.author}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function GetInTouch() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Contact Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-extrabold leading-tight">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-100">
            Have questions, feedback, or want to collaborate?  
            We’d love to hear from you. Reach out using the details below or send us a message.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-lg">support@smartclassroom.com</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-lg">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-lg">Kolkata, West Bengal, India</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Contact Form */}
        <motion.form
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6 text-gray-900"
        >
          <h3 className="text-2xl font-bold text-indigo-700">
            Send us a Message
          </h3>
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>

      {/* Decorative background shapes */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-10 left-10 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-400 rounded-full opacity-20 blur-3xl"
      />
    </section>
  );
}

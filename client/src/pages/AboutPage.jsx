import React from "react";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">About Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            We are a team of passionate innovators dedicated to revolutionizing
            the education system. Our Smart Classroom project aims to create a
            seamless, efficient, and engaging learning environment for both
            students and teachers.
          </p>
        </div>
        <div className="mt-10">
          <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
            <div>
              <img
                className="rounded-lg shadow-lg"
                src="/images/classroom.jpg"
                alt="Classroom"
              />
            </div>
            <div className="mt-8 md:mt-0">
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              <p className="mt-3 text-gray-600">
                Our mission is to leverage technology to automate administrative
                tasks like attendance, allowing educators to focus on what they
                do best: teaching. We also aim to empower students by providing
                them with personalized tools to make the most of their academic
                journey, turning free periods into productive learning
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We are a team of passionate innovators dedicated to revolutionizing
            the education system through technology.
          </p>
        </div>
        <div className="mt-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="relative h-80">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                src="/images/classroom.jpg"
                alt="Modern classroom"
              />
            </div>
            <div className="mt-8 lg:mt-0">
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              <p className="mt-3 text-gray-600 text-base">
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
      </main>
    </div>
  );
}

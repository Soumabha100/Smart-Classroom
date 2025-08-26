import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Data for our features section
const features = [
  {
    icon: '✔️', // Placeholder icon
    title: 'Automated Attendance',
    description: 'Effortlessly mark attendance with QR codes, saving valuable class time.'
  },
  {
    icon: '🎯', // Placeholder icon
    title: 'Personalized Activities',
    description: 'Turn free periods into productive learning sessions with AI-powered recommendations.'
  },
  {
    icon: '📊', // Placeholder icon
    title: 'Real-time Analytics',
    description: 'Gain insights into student engagement and performance with our powerful dashboards.'
  }
];

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative h-[600px] w-full bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 text-center p-8 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            The Future of Classroom Management is Here
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light">
            Seamless attendance, personalized learning, and powerful analytics, all in one platform.
          </p>
          <Link 
            to="/register" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
          >
            Join for Free
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Why Smart Classroom?</h2>
          <p className="text-gray-600 mb-12 text-lg">Everything you need to create a more efficient and engaging learning environment.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Transform Your Classroom?</h2>
          <p className="mb-8 text-blue-100 text-lg">
            Sign up today and take the first step towards a smarter, more productive educational experience.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
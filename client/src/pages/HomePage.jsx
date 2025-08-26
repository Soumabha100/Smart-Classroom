import React from "react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  // When referencing images from the `public` folder, you use a direct path from the root.
  return (
    <div className="bg-gray-50">
      <Navbar />
      <section
        className="home"
        style={{
          backgroundImage: "url(/images/home.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-5xl font-extrabold mb-4">
              EMPOWERING EDUCATION FOR A BRIGHTER FUTURE
            </h1>
            <p className="text-lg mb-8">
              Transforming classrooms with innovative technology.
            </p>
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              CONTACT US
            </a>
          </div>
        </div>
      </section>
      {/* You can continue converting other sections from index.html here */}
    </div>
  );
}

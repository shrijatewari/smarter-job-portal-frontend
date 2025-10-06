import React from "react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-roastedPeach to-cream text-center py-24 px-4">
      <p className="text-eucalyptus text-lg mb-2">Welcome to Smarter Job Portal</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-milkyCoffee">
        Find Your Dream Job or Internship! 🚀
      </h1>
      <p className="text-eucalyptus mb-6 text-lg">
        Explore thousands of opportunities and kickstart your career today.
      </p>
      <div className="space-x-4">
        <button className="bg-milkyCoffee text-white px-6 py-2 rounded hover:bg-eucalyptus transition">
          Browse Jobs
        </button>
        <button className="bg-eucalyptus text-white px-6 py-2 rounded hover:bg-milkyCoffee transition">
          Post a Job
        </button>
      </div>
    </div>
  );
};

export default Hero;

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p>&copy; {new Date().getFullYear()} Doctor Appointment System</p>
      <div>
        <a href="https://linkedin.com" target="_blank" className="text-blue-500 hover:underline mr-2">LinkedIn</a>
        <a href="https://github.com" target="_blank" className="text-blue-500 hover:underline">GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;

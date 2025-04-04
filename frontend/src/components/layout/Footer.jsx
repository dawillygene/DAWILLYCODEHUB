// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p>&copy; {new Date().getFullYear()} Program Sharing Platform. All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="/privacy" className="hover:text-gray-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-gray-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
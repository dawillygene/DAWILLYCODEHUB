// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center items-center h-48">
        <h1 className="text-5xl font-bold text-gray-800">404</h1>
      </div>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
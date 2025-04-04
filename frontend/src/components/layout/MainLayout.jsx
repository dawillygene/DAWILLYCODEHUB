// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./Header";
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet /> {/* This renders nested routes */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Program Sharing Platform
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/programs" className="text-gray-600 hover:text-gray-800">
                Programs
              </Link>
            </li>
            <li>
              <Link to="/programs/create" className="text-gray-600 hover:text-gray-800">
                Upload
              </Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-gray-800">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-gray-800">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
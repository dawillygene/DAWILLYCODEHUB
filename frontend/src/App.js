// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import CreateProgram from './pages/CreateProgram';
import EditProgram from './pages/EditProgram';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:id" element={<ProgramDetail />} />
            
            {/* Protected routes */}
            <Route
              path="programs/create"
              element={
                <ProtectedRoute>
                  <CreateProgram />
                </ProtectedRoute>
              }
            />
            <Route
              path="programs/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProgram />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
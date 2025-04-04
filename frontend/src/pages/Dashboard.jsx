import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import programService from '../services/program.service';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPrograms = async () => {
      try {
        setLoading(true);
        const { data } = await programService.getPrograms({ userId: user.id });
        setPrograms(data.data);
      } catch (error) {
        console.error('Error fetching user programs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPrograms();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
        <p>Your email: {user.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Programs</h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">Loading...</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p>You haven't uploaded any programs yet.</p>
            <Link
              to="/programs/create"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Your First Program
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description.substring(0, 100)}...</p>
                <div className="flex justify-between">
                  <Link
                    to={`/programs/${program.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View
                  </Link>
                  <Link
                    to={`/programs/${program.id}/edit`}
                    className="text-green-600 hover:text-green-700"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
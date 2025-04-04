import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import programService from '../services/program.service';
import CommentSection from '../components/programs/CommentSection';

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const { data } = await programService.getProgram(id);
        setProgram(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load program');
        console.error('Error fetching program:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await programService.downloadProgram(id);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', program.title.replace(/\s+/g, '_').toLowerCase() + '_v' + program.version + '.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download the program. Please try again.');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      try {
        await programService.deleteProgram(id);
        navigate('/programs');
      } catch (err) {
        alert('Failed to delete the program. Please try again.');
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">Program not found</h3>
          <Link to="/programs" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
            Back to programs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && program.user_id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Program Header */}
        <div className="relative">
          {program.thumbnail_path ? (
            <div className="h-64 w-full bg-gray-200">
              <img
                src={`${process.env.REACT_APP_STORAGE_URL}/${program.thumbnail_path}`}
                alt={program.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 w-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <i className="fas fa-code text-white text-6xl"></i>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="p-6 w-full">
              <div className="flex flex-wrap justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{program.title}</h1>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  {isOwner && (
                    <>
                      <Link
                        to={`/programs/${id}/edit`}
                        className="bg-white text-gray-800 hover:bg-gray-100 rounded-md py-2 px-4 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white hover:bg-red-700 rounded-md py-2 px-4 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className={`bg-green-600 text-white hover:bg-green-700 rounded-md py-2 px-4 text-sm font-medium ${
                      downloading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {downloading ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="p-6">
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 space-x-4">
            <span>
              <i className="fas fa-user mr-1"></i> {program.user.name}
            </span>
            <span>
              <i className="fas fa-calendar mr-1"></i>{' '}
              {new Date(program.created_at).toLocaleDateString()}
            </span>
            <span>
              <i className="fas fa-code mr-1"></i> {program.programming_language}
            </span>
            <span>
              <i className="fas fa-tag mr-1"></i> v{program.version}
            </span>
            <span>
              <i className="fas fa-download mr-1"></i> {program.download_count} downloads
            </span>
            <span>
              <i className="fas fa-eye mr-1"></i> {program.view_count} views
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div className="prose max-w-none">{program.description}</div>
          </div>

          {program.categories && program.categories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {program.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/programs?category=${category.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <CommentSection programId={id} comments={program.comments || []} />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
// src/pages/EditProgram.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProgramForm from '../components/programs/ProgramForm';
import programService from '../services/program.service';

const EditProgram = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const { data } = await programService.getProgram(id);
        setProgram(data);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!program) {
    return <div className="text-center py-12">Program not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Program</h1>
      <ProgramForm program={program} />
    </div>
  );
};

export default EditProgram;
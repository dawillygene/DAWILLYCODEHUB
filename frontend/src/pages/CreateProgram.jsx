// src/pages/CreateProgram.jsx
import React from 'react';
import ProgramForm from '../components/programs/ProgramForm';

const CreateProgram = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upload New Program</h1>
      <ProgramForm />
    </div>
  );
};

export default CreateProgram;
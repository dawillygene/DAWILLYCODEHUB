import api from './api';

const programService = {
  // Get all programs with optional filters
  getPrograms: (params = {}) => {
    return api.get('/programs', { params });
  },
  
  // Get a specific program by ID
  getProgram: (id) => {
    return api.get(`/programs/${id}`);
  },
  
  // Create a new program
  createProgram: (programData) => {
    // Using FormData for file uploads
    const formData = new FormData();
    
    // Append basic data
    formData.append('title', programData.title);
    formData.append('description', programData.description);
    formData.append('programming_language', programData.programming_language);
    formData.append('version', programData.version);
    
    // Append file
    if (programData.file) {
      formData.append('file', programData.file);
    }
    
    // Append thumbnail if available
    if (programData.thumbnail) {
      formData.append('thumbnail', programData.thumbnail);
    }
    
    // Append categories
    if (programData.categories && programData.categories.length > 0) {
      programData.categories.forEach((categoryId) => {
        formData.append('categories[]', categoryId);
      });
    }
    
    // Append status if available
    if (programData.status) {
      formData.append('status', programData.status);
    }
    
    return api.post('/programs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update an existing program
  updateProgram: (id, programData) => {
    const formData = new FormData();
    
    // Append all fields that may have changed
    if (programData.title) formData.append('title', programData.title);
    if (programData.description) formData.append('description', programData.description);
    if (programData.programming_language) formData.append('programming_language', programData.programming_language);
    if (programData.version) formData.append('version', programData.version);
    if (programData.status) formData.append('status', programData.status);
    
    // Append new file if available
    if (programData.file) {
      formData.append('file', programData.file);
    }
    
    // Append new thumbnail if available
    if (programData.thumbnail) {
      formData.append('thumbnail', programData.thumbnail);
    }
    
    // Append categories if available
    if (programData.categories && programData.categories.length > 0) {
      programData.categories.forEach((categoryId) => {
        formData.append('categories[]', categoryId);
      });
    }
    
    return api.post(`/programs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Use PUT method with form data
      _method: 'PUT',
    });
  },
  
  // Delete a program
  deleteProgram: (id) => {
    return api.delete(`/programs/${id}`);
  },
  
  // Download a program
  downloadProgram: (id) => {
    return api.get(`/programs/${id}/download`, {
      responseType: 'blob'
    });
  },
  
  // Add a comment to a program
  addComment: (programId, content) => {
    return api.post(`/programs/${programId}/comments`, { content });
  },
  
  // Update a comment
  updateComment: (commentId, content) => {
    return api.put(`/comments/${commentId}`, { content });
  },
  
  // Delete a comment
  deleteComment: (commentId) => {
    return api.delete(`/comments/${commentId}`);
  },
};

export default programService;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import programService from '../../services/program.service';
// import { categoryService } from '../../services/category.service';

const ProgramForm = ({ program = null }) => {
  const isEditing = !!program;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    program?.thumbnail_path ? `${process.env.REACT_APP_STORAGE_URL}/${program.thumbnail_path}` : null
  );
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: program?.title || '',
      description: program?.description || '',
      programming_language: program?.programming_language || '',
      version: program?.version || '',
      status: program?.status || 'published',
      categories: program?.categories?.map(cat => cat.id) || [],
    }
  });

  // Watch for file changes
  const watchFile = watch('file');
  const watchThumbnail = watch('thumbnail');

//   useEffect(() => {
//     // Fetch all categories
//     const fetchCategories = async () => {
//       try {
//         const { data } = await categoryService.getCategories();
//         setCategories(data);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//       }
//     };

//     fetchCategories();
//   }, []);

  useEffect(() => {
    // Generate preview for selected file
    if (watchFile && watchFile[0]) {
      const file = watchFile[0];
      // Show file name and size for non-image files
      setFilePreview(`${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    }
  }, [watchFile]);

  useEffect(() => {
    // Generate preview for selected thumbnail
    if (watchThumbnail && watchThumbnail[0]) {
      const file = watchThumbnail[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [watchThumbnail]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Prepare the data
      const formData = {
        ...data,
        file: data.file?.[0] || null,
        thumbnail: data.thumbnail?.[0] || null,
      };
      
      // Call the appropriate service method
      if (isEditing) {
        await programService.updateProgram(program.id, formData);
        navigate(`/programs/${program.id}`);
      } else {
        const response = await programService.createProgram(formData);
        navigate(`/programs/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save the program. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Program Title *
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter program title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          rows="5"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Describe your program, its features, and how to use it"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="programming_language" className="block text-sm font-medium text-gray-700 mb-1">
            Programming Language *
          </label>
          <input
            id="programming_language"
            {...register('programming_language', { required: 'Programming language is required' })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Python, JavaScript, Java"
          />
          {errors.programming_language && (
            <p className="mt-1 text-sm text-red-600">{errors.programming_language.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
            Version *
          </label>
          <input
            id="version"
            {...register('version', { required: 'Version is required' })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., 1.0.0"
          />
          {errors.version && <p className="mt-1 text-sm text-red-600">{errors.version.message}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
          Categories *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.id}
                {...register('categories', { required: 'Select at least one category' })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                {category.name}
              </label>
            </div>
          ))}
        </div>
        {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Program File {!isEditing && '*'}
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="file"
              {...register('file', { required: !isEditing ? 'Program file is required' : false })}
              className="sr-only"
            />
            <label
              htmlFor="file"
              className="relative cursor-pointer rounded-md bg-white py-2 px-3 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>Upload file</span>
            </label>
            <span className="ml-3 text-sm text-gray-500">{filePreview}</span>
          </div>
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>}
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              {...register('thumbnail')}
              className="sr-only"
            />
            <label
              htmlFor="thumbnail"
              className="relative cursor-pointer rounded-md bg-white py-2 px-3 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>Upload image</span>
            </label>
            <span className="ml-3 text-sm text-gray-500">
              {watchThumbnail?.[0]?.name || (program?.thumbnail_path && !watchThumbnail?.[0] ? 'Current thumbnail' : '')}
            </span>
          </div>
          {thumbnailPreview && (
            <div className="mt-2">
              <img src={thumbnailPreview} alt="Thumbnail preview" className="h-24 w-auto object-cover rounded" />
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            submitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Saving...' : isEditing ? 'Update Program' : 'Upload Program'}
        </button>
      </div>
    </form>
  );
};

export default ProgramForm;
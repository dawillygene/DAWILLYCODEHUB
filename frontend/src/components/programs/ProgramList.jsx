import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import programService from '../../services/program.service';
import categoryService from '../../services/category.service';
import ProgramCard from './ProgramCard';
import Pagination from '../shared/Pagination';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'created_at',
    direction: 'desc',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 9,
    total: 0,
    lastPage: 1,
  });

  useEffect(() => {
    // Fetch categories for the filter
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch programs when filters or pagination changes
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const params = {
          ...filters,
          page: pagination.currentPage,
          per_page: pagination.perPage,
        };

        const { data } = await programService.getPrograms(params);
        setPrograms(data.data);
        setPagination({
          ...pagination,
          total: data.total,
          lastPage: data.last_page,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch programs');
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [filters, pagination.currentPage, pagination.perPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (<div className="container mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <h1 className="text-3xl font-bold mb-4 md:mb-0">Available Programs</h1>
      <Link
        to="/programs/create"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
      >
        Upload Program
      </Link>
    </div>

    {/* Filters */}
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search programs..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="created_at">Date</option>
            <option value="title">Title</option>
            <option value="download_count">Downloads</option>
            <option value="view_count">Views</option>
          </select>
        </div>

        <div>
          <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            id="direction"
            name="direction"
            value={filters.direction}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>

    {/* Programs Grid */}
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    ) : error ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    ) : programs.length === 0 ? (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500">No programs found</h3>
        <p className="mt-2 text-gray-400">Try adjusting your filters or upload a program.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    )}

    {/* Pagination */}
    {!loading && programs.length > 0 && (
      <Pagination
        currentPage={pagination.currentPage}
        lastPage={pagination.lastPage}
        onPageChange={handlePageChange}
      />
    )}
  </div>
);
};

export default ProgramList;
/**
 * TestimonialList Component
 * 
 * This component displays a list of testimonials in a card-based layout.
 * Features include:
 * - Search functionality across testimonial content and customer names
 * - Rating filtering
 * - Status filtering (Published, Draft, Archived)
 * - Bulk operations (select and delete multiple testimonials)
 * - Pagination with navigation controls
 * - Star rating display
 */

import { useState, useEffect } from 'react';
import { 
  Search
} from 'lucide-react';
import 'react-hot-toast';
import testimonialService from '../services/testimonialService.js';

const TestimonialList = ({ onCreateNew, onEdit, onView, refreshTrigger }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Fetch testimonials when component mounts or refreshTrigger changes
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: searchTerm,
        };
        
        const response = await testimonialService.getTestimonials(params);
        
        setTestimonials(response.data || []);
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          limit: pagination.limit,
        });
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Please try again later.");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [pagination.currentPage, pagination.limit, searchTerm, refreshTrigger]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination({ ...pagination, currentPage: 1 });
  };

  

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-gray-600 mt-1">Manage your customer testimonials</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Testimonial
        </button>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search testimonials..."
                className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No testimonials found. Create your first testimonial!
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Quote</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Rating</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {testimonial.name || "Anonymous"}
                          {testimonial.company && (
                            <div className="text-xs text-gray-500">
                              {testimonial.company}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{truncateText(testimonial.quote, 60)}</td>
                        <td className="px-4 py-3">
                          {testimonial.rating ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {testimonial.rating}/5
                            </span>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onView(testimonial)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              View
                            </button>
                            <button
                              onClick={() => onEdit(testimonial)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialList;
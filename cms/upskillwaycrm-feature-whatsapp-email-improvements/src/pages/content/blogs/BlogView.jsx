import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Calendar, User, Tag, Trash2 } from "lucide-react";
import blogsApi from "../../../services/api/blogsApi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import toastUtils from "../../../utils/toastUtils";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isLoading: false
  });

  const handleDelete = () => {
    if (!blog) return;

    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      const response = await blogsApi.deleteBlog(id);
      
      if (response.success) {
        toastUtils.crud.deleted('Blog');
        navigate('/dashboard/content/blogs');
      } else {
        throw new Error(response.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toastUtils.crud.deleteError('Blog', error.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, isLoading: false });
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogsApi.getBlogById(id);
        
        if (response.success) {
          setBlog(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch blog');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toastUtils.crud.fetchError('Blog', error.message);
        navigate('/dashboard/content/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!blog) return <div className="text-center py-12"><p className="text-gray-500">Blog not found</p></div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/content/blogs')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
            <p className="text-gray-600 mt-2">{blog.excerpt}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/dashboard/content/blogs/${id}/edit`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="aspect-video w-full">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Blog Meta */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Created: {formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Updated: {formatDate(blog.updatedAt)}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>Author: {blog.creator?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(blog.status)}`}>
                {blog.status}
              </span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {blog.content}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={blog?.title || ''}
        itemType="Blog"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default BlogView;

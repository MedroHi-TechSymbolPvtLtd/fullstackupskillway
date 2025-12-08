import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogForm from '../../../components/forms/BlogForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import blogsApi from '../../../services/api/blogsApi';
import toast from 'react-hot-toast';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogsApi.getBlogById(id);
      
      if (response.success) {
        setBlog(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch blog');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error(error.message || 'Failed to fetch blog');
      navigate('/dashboard/content/blogs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);
      const response = await blogsApi.updateBlog(id, formData);
      
      if (response.success) {
        toast.success('Blog updated successfully!');
        navigate('/dashboard/content/blogs', { state: { refresh: true }, replace: true });
      } else {
        throw new Error(response.message || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.message || 'Failed to update blog');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
        <p className="text-gray-600 mt-2">Update your blog post</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/content/blogs')}
          isLoading={submitLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default BlogEdit;
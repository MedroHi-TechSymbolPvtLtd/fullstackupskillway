import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../../../components/forms/BlogForm';
import blogsApi from '../../../services/api/blogsApi';
import toast from 'react-hot-toast';

const BlogCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await blogsApi.createBlog(formData);
      
      if (response.success) {
        toast.success('Blog created successfully!');
        navigate('/dashboard/content/blogs', { state: { refresh: true }, replace: true });
      } else {
        throw new Error(response.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
        <p className="text-gray-600 mt-2">Add a new blog post to your content library</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <BlogForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/content/blogs')}
          isLoading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default BlogCreate;
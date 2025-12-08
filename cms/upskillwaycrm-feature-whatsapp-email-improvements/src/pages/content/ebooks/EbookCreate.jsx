import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EbookForm from '../../../components/forms/EbookForm';
import ebooksApi from '../../../services/api/ebooksApi';
import toast from 'react-hot-toast';

const EbookCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ebookData) => {
    try {
      setLoading(true);
      const response = await ebooksApi.createEbook(ebookData);
      
      if (response.success) {
        toast.success('Ebook created successfully!');
        navigate('/dashboard/content/ebooks');
      } else {
        throw new Error(response.message || 'Failed to create ebook');
      }
    } catch (error) {
      console.error('Error creating ebook:', error);
      toast.error(error.message || 'Failed to create ebook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Ebook</h1>
        <p className="text-gray-600 mt-2">Add a new ebook to your digital library</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <EbookForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/content/ebooks')}
          isLoading={loading}
          isEdit={false}
          submitButtonText="Create Ebook"
        />
      </div>
    </div>
  );
};

export default EbookCreate;
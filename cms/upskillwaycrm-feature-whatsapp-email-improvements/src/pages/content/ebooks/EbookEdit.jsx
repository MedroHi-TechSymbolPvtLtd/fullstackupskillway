import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EbookForm from '../../../components/forms/EbookForm';
import ebooksApi from '../../../services/api/ebooksApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EbookEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchEbook();
  }, [id]);

  const fetchEbook = async () => {
    try {
      setLoading(true);
      const response = await ebooksApi.getEbookById(id);
      
      if (response.success) {
        setEbook(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch ebook');
      }
    } catch (error) {
      console.error('Error fetching ebook:', error);
      toast.error(error.message || 'Failed to fetch ebook');
      navigate('/dashboard/content/ebooks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (ebookData) => {
    try {
      setSubmitLoading(true);
      const response = await ebooksApi.updateEbook(id, ebookData);
      
      if (response.success) {
        toast.success('Ebook updated successfully!');
        navigate('/dashboard/content/ebooks');
      } else {
        throw new Error(response.message || 'Failed to update ebook');
      }
    } catch (error) {
      console.error('Error updating ebook:', error);
      toast.error(error.message || 'Failed to update ebook');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!ebook) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ebook not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Ebook</h1>
        <p className="text-gray-600 mt-2">Update your ebook details</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <EbookForm
          initialData={ebook}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/content/ebooks')}
          isLoading={submitLoading}
          isEdit={true}
          submitButtonText="Update Ebook"
        />
      </div>
    </div>
  );
};

export default EbookEdit;
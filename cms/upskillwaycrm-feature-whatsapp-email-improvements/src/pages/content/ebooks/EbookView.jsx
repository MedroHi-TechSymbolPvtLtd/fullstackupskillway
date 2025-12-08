import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Download, BookOpen, Calendar, Tag, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Modal from '../../../components/common/Modal';
import ebooksApi from '../../../services/api/ebooksApi';
import toast from 'react-hot-toast';

const EbookView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    } catch (err) {
      console.error('Error fetching ebook:', err);
      toast.error('Failed to load ebook');
      navigate('/dashboard/content/ebooks');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/content/ebooks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await ebooksApi.deleteEbook(id);
      
      if (response.success) {
        toast.success('Ebook deleted successfully');
        navigate('/dashboard/content/ebooks');
      } else {
        throw new Error(response.message || 'Failed to delete ebook');
      }
    } catch (err) {
      console.error('Error deleting ebook:', err);
      toast.error(err.message || 'Failed to delete ebook');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!ebook) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ebook not found</h3>
        <p className="text-gray-500 mb-4">The ebook you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/content/ebooks')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ebooks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/content/ebooks')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ebook.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(ebook.status)}
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                Created {formatDate(ebook.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {ebook.pdfUrl && (
            <a
              href={ebook.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </a>
          )}
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{ebook.description}</p>
            </div>
          </div>

          {/* Video Preview */}
          {ebook.videoUrl && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Video</h2>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <a
                  href={ebook.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Video
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          {ebook.coverImageUrl && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover</h2>
              <img
                src={ebook.coverImageUrl}
                alt={ebook.title}
                className="w-full rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Slug
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {ebook.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                <div>{getStatusBadge(ebook.status)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created
                </label>
                <div className="flex items-center text-sm text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(ebook.createdAt)}
                </div>
              </div>

              {ebook.updatedAt !== ebook.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(ebook.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {ebook.tags && ebook.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {ebook.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {ebook.pdfUrl && (
                <a
                  href={ebook.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              )}
              
              {ebook.videoUrl && (
                <a
                  href={ebook.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Video
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Ebook"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{ebook.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EbookView;
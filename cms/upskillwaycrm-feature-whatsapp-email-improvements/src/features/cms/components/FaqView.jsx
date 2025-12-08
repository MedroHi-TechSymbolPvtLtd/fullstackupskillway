// FaqView component
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  Eye,
  Share2,
  HelpCircle
} from 'lucide-react';

const FaqView = ({ faq, onEdit, onDelete, onBack }) => {
  if (!faq) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">FAQ not found</h3>
          <p className="text-gray-500">The FAQ you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'Getting Started': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Account': { bg: 'bg-green-100', text: 'text-green-800' },
      'Billing': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Technical': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'General': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'Support': { bg: 'bg-pink-100', text: 'text-pink-800' },
    };

    const config = categoryColors[category] || categoryColors['General'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {category}
      </span>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: faq.question,
          text: faq.answer,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Q: ${faq.question}\nA: ${faq.answer}`);
      // You could show a toast here
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to FAQs
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
          <button
            onClick={() => onEdit(faq)}
            className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(faq.id)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* FAQ Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(faq.createdAt)}</span>
              </div>
              {faq.updatedAt !== faq.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated: {formatDate(faq.updatedAt)}</span>
                </div>
              )}
              {faq.creator && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{faq.creator.name || 'Unknown Author'}</span>
                </div>
              )}
            </div>
            {faq.category && getCategoryBadge(faq.category)}
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {faq.question}
                </h1>
              </div>
            </div>
          </div>

          {/* Answer */}
          <div className="mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">A</span>
              </div>
              <div className="flex-1">
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Information */}
          {faq.category && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                  <p className="text-sm text-gray-600">{faq.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>FAQ ID: {faq.id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onEdit(faq)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Edit this FAQ
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onBack}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Back to all FAQs
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Additional Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onEdit(faq)}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit FAQ
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share FAQ
          </button>
          <button
            onClick={() => {
              // Copy FAQ content to clipboard
              navigator.clipboard.writeText(`Q: ${faq.question}\nA: ${faq.answer}`);
            }}
            className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Eye className="h-5 w-5 mr-2" />
            Copy Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqView;
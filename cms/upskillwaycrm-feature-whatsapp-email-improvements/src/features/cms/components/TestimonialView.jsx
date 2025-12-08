// TestimonialView component
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Share2,
  Star,
  Play,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Copy
} from 'lucide-react';

const TestimonialView = ({ testimonial, onEdit, onDelete, onBack }) => {
  if (!testimonial) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Testimonial not found</h3>
          <p className="text-gray-500">The testimonial you're looking for doesn't exist.</p>
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
        icon: CheckCircle
      },
      pending: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        label: "Pending",
        icon: Clock
      },
      rejected: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        label: "Rejected",
        icon: XCircle
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getAvatarUrl = () => {
    if (testimonial.avatarUrl && testimonial.avatarUrl !== 'https://example.com/avatar.jpg') {
      return testimonial.avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=f97316&color=fff&size=128&bold=true`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Testimonial from ${testimonial.authorName}`,
          text: testimonial.text,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`"${testimonial.text}" - ${testimonial.authorName}, ${testimonial.role}`);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`"${testimonial.text}" - ${testimonial.authorName}, ${testimonial.role}`);
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
          Back to Testimonials
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
            onClick={() => onEdit(testimonial)}
            className="flex items-center px-4 py-2 text-yellow-600 hover:text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(testimonial.id)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(testimonial.createdAt)}</span>
              </div>
              {testimonial.updatedAt !== testimonial.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated: {formatDate(testimonial.updatedAt)}</span>
                </div>
              )}
              {testimonial.creator && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{testimonial.creator.name || 'Unknown'}</span>
                </div>
              )}
            </div>
            {getStatusBadge(testimonial.status)}
          </div>

          {/* Testimonial Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 mb-8 border border-yellow-200">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <img
                src={getAvatarUrl()}
                alt={testimonial.authorName}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0 shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=f97316&color=fff&size=128&bold=true`;
                }}
              />
              
              <div className="flex-1">
                {/* Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-xl text-gray-800 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </blockquote>
                
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.authorName}
                    </h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                  
                  {/* Video Link */}
                  {testimonial.videoUrl && (
                    <a
                      href={testimonial.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-white bg-opacity-80 text-gray-700 rounded-lg hover:bg-opacity-100 transition-all shadow-sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Author Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Author Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{testimonial.authorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{testimonial.role}</span>
                </div>
                {testimonial.avatarUrl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avatar:</span>
                    <a 
                      href={testimonial.avatarUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Media Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Media & Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(testimonial.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Video:</span>
                  <span className="font-medium">
                    {testimonial.videoUrl ? (
                      <a 
                        href={testimonial.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Available
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Text Length:</span>
                  <span className="font-medium">{testimonial.text.length} characters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Testimonial ID: {testimonial.id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCopyText}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Text
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => onEdit(testimonial)}
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Edit testimonial
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onBack}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Back to all testimonials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onEdit(testimonial)}
            className="flex items-center justify-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy Text
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
          {testimonial.videoUrl && (
            <a
              href={testimonial.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialView;
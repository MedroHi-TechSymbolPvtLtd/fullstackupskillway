/**
 * EbookView Component
 * 
 * This component displays detailed information about a single ebook.
 * Features include:
 * - Ebook header with cover image and status
 * - Detailed ebook information display
 * - Status indicators and badges
 * - Action buttons for edit, delete, share
 * - PDF download and video links
 * - Tag display and metadata
 * - Creator information and timestamps
 */

import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  Eye,
  ExternalLink,
  Share2,
  Play,
  BookOpen,
  Download,
  CheckCircle,
  Clock,
  Archive,
  Copy,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

/**
 * EbookView functional component
 * @param {Object} ebook - Ebook object to display
 * @param {Function} onEdit - Callback when user wants to edit the ebook
 * @param {Function} onDelete - Callback when user wants to delete the ebook
 * @param {Function} onBack - Callback when user wants to go back to ebook list
 */
const EbookView = ({ ebook, onEdit, onDelete, onBack }) => {
  // Handle case where ebook is not provided
  if (!ebook) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ebook not found</h3>
          <p className="text-gray-500">The ebook you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  /**
   * Format date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date with time
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge component for ebook status
   * @param {string} status - Ebook status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
        icon: CheckCircle
      },
      draft: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        label: "Draft",
        icon: Clock
      },
      archived: { 
        bg: "bg-gray-100", 
        text: "text-gray-800", 
        label: "Archived",
        icon: Archive
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  /**
   * Get ebook cover image with fallback
   * @returns {string} Cover image URL
   */
  const getEbookCover = () => {
    return ebook.coverImageUrl || `https://via.placeholder.com/400x600/6366f1/ffffff?text=${encodeURIComponent(ebook.title.substring(0, 20))}`;
  };

  /**
   * Handle sharing the ebook
   * Uses Web Share API if available, otherwise copies to clipboard
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ebook.title,
          text: ebook.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy ebook info to clipboard
      navigator.clipboard.writeText(`${ebook.title} - ${ebook.description}`);
    }
  };

  /**
   * Copy ebook information to clipboard
   */
  const handleCopyInfo = () => {
    const ebookInfo = `Ebook: ${ebook.title}\nDescription: ${ebook.description}\nStatus: ${ebook.status}`;
    navigator.clipboard.writeText(ebookInfo);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Ebooks
        </button>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
          <button
            onClick={() => onEdit(ebook)}
            className="flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(ebook.id)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Ebook Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover Image Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Cover Image */}
              <div className="aspect-[3/4] bg-gray-100 relative">
                <img 
                  src={getEbookCover()} 
                  alt={ebook.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x600/6366f1/ffffff?text=${encodeURIComponent(ebook.title.substring(0, 20))}`;
                  }}
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(ebook.status)}
                </div>
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex space-x-3">
                    {ebook.pdfUrl && (
                      <a
                        href={ebook.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                        title="Download PDF"
                      >
                        <Download className="h-6 w-6 text-gray-700" />
                      </a>
                    )}
                    {ebook.videoUrl && (
                      <a
                        href={ebook.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                        title="Watch Video"
                      >
                        <Play className="h-6 w-6 text-gray-700" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-4 space-y-3">
                {ebook.pdfUrl && (
                  <a
                    href={ebook.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </a>
                )}
                
                {ebook.videoUrl && (
                  <a
                    href={ebook.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Video
                  </a>
                )}
                
                <button
                  onClick={() => onEdit(ebook)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Edit3 className="h-5 w-5 mr-2" />
                  Edit Ebook
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created: {formatDate(ebook.createdAt)}</span>
                  </div>
                  {ebook.updatedAt !== ebook.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Updated: {formatDate(ebook.updatedAt)}</span>
                    </div>
                  )}
                  {ebook.creator && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{ebook.creator.name || 'Unknown Author'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ebook Title and Description */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {ebook.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {ebook.description}
                </p>
              </div>

              {/* Ebook Tags */}
              {ebook.tags && ebook.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  <div className="flex items-center text-sm text-gray-500 mr-2">
                    <Tag className="h-4 w-4 mr-1" />
                    Tags:
                  </div>
                  {ebook.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Ebook Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Ebook Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Ebook Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(ebook.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slug:</span>
                      <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{ebook.slug}</span>
                    </div>
                    {ebook.pdfUrl && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">PDF File:</span>
                        <a 
                          href={ebook.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </div>
                    )}
                    {ebook.videoUrl && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Video:</span>
                        <a 
                          href={ebook.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 flex items-center"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Watch
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ebook Statistics */}
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-indigo-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Ebook Metrics
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Description Length:</span>
                      <span className="font-medium">{ebook.description ? ebook.description.length : 0} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Tags Count:</span>
                      <span className="font-medium">{ebook.tags ? ebook.tags.length : 0} tags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Has PDF:</span>
                      <span className="font-medium">{ebook.pdfUrl ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Has Video:</span>
                      <span className="font-medium">{ebook.videoUrl ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Has Cover:</span>
                      <span className="font-medium">{ebook.coverImageUrl ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Cover Image */}
                {ebook.coverImageUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Cover Image
                    </h4>
                    <a
                      href={ebook.coverImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Original
                    </a>
                  </div>
                )}

                {/* PDF File */}
                {ebook.pdfUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF File
                    </h4>
                    <a
                      href={ebook.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </a>
                  </div>
                )}

                {/* Video */}
                {ebook.videoUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Video
                    </h4>
                    <a
                      href={ebook.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Watch Video
                    </a>
                  </div>
                )}
              </div>

              {/* Ebook URL Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Ebook URL Slug</h3>
                    <p className="text-sm text-gray-600 font-mono">{ebook.slug}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(ebook.slug)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Copy
                    </button>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Ebook ID: {ebook.id}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleCopyInfo}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Info
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => onEdit(ebook)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Edit this ebook
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={onBack}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Back to all ebooks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onEdit(ebook)}
            className="flex items-center justify-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Ebook
          </button>
          <button
            onClick={handleCopyInfo}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy Info
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Ebook
          </button>
          {ebook.pdfUrl && (
            <a
              href={ebook.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EbookView;
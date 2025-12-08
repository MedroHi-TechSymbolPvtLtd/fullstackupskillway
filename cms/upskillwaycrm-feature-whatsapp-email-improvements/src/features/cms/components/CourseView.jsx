/**
 * CourseView Component
 * 
 * This component displays detailed information about a single course.
 * Features include:
 * - Course header with thumbnail and pricing
 * - Detailed course information display
 * - Status indicators and badges
 * - Action buttons for edit, delete, share
 * - Demo video integration
 * - Syllabus and tag display
 * - Creator information and timestamps
 */

import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink,
  Share2,
  Play,
  BookOpen,
  DollarSign,
  CheckCircle,
  Clock,
  Archive,
  Copy
} from 'lucide-react';

/**
 * CourseView functional component
 * @param {Object} course - Course object to display
 * @param {Function} onEdit - Callback when user wants to edit the course
 * @param {Function} onDelete - Callback when user wants to delete the course
 * @param {Function} onBack - Callback when user wants to go back to course list
 */
const CourseView = ({ course, onEdit, onDelete, onBack }) => {
  // Handle case where course is not provided
  if (!course) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
          <p className="text-gray-500">The course you're looking for doesn't exist.</p>
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
   * Format price for display
   * @param {string|number} price - Course price
   * @returns {string} Formatted price with currency symbol
   */
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Free' : `$${numPrice.toFixed(2)}`;
  };

  /**
   * Get status badge component for course status
   * @param {string} status - Course status (published, draft, archived)
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
   * Get course thumbnail URL
   * @returns {string} Thumbnail URL
   */
  const getCourseThumbnail = () => {
    return `https://via.placeholder.com/800x450/8b5cf6/ffffff?text=${encodeURIComponent(course.title.substring(0, 20))}`;
  };

  /**
   * Handle sharing the course
   * Uses Web Share API if available, otherwise copies to clipboard
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy course info to clipboard
      navigator.clipboard.writeText(`${course.title} - ${course.description}`);
    }
  };

  /**
   * Copy course information to clipboard
   */
  const handleCopyInfo = () => {
    const courseInfo = `Course: ${course.title}\nDescription: ${course.description}\nPrice: ${formatPrice(course.price)}\nStatus: ${course.status}`;
    navigator.clipboard.writeText(courseInfo);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Courses
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
            onClick={() => onEdit(course)}
            className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Course Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Course Header with Thumbnail */}
        <div className="aspect-video bg-gray-100 relative">
          <img 
            src={getCourseThumbnail()} 
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Course';
            }}
          />
          
          {/* Overlay with Play Button */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-6 hover:bg-opacity-100 transition-all cursor-pointer">
              <Play className="h-16 w-16 text-purple-600" />
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {getStatusBadge(course.status)}
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
              {formatPrice(course.price)}
            </span>
          </div>
          
          {/* Demo Video Link */}
          {course.videoDemoUrl && (
            <a
              href={course.videoDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg hover:bg-opacity-100 transition-all"
            >
              <ExternalLink className="h-5 w-5 text-gray-700" />
            </a>
          )}
        </div>
        
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(course.createdAt)}</span>
              </div>
              {course.updatedAt !== course.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated: {formatDate(course.updatedAt)}</span>
                </div>
              )}
              {course.creator && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{course.creator.name || 'Unknown Author'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Title and Description */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Course Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="flex items-center text-sm text-gray-500 mr-2">
                <Tag className="h-4 w-4 mr-1" />
                Tags:
              </div>
              {course.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Course Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(course.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-lg">{formatPrice(course.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slug:</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{course.slug}</span>
                </div>
                {course.videoDemoUrl && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Demo Video:</span>
                    <a 
                      href={course.videoDemoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 flex items-center"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Course Statistics */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Course Metrics
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Content Length:</span>
                  <span className="font-medium">{course.syllabus ? course.syllabus.length : 0} characters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Tags Count:</span>
                  <span className="font-medium">{course.tags ? course.tags.length : 0} tags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Has Demo:</span>
                  <span className="font-medium">{course.videoDemoUrl ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Course Type:</span>
                  <span className="font-medium">{parseFloat(course.price) > 0 ? 'Paid' : 'Free'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Syllabus */}
          {course.syllabus && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Course Syllabus
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {course.syllabus}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course URL Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Course URL Slug</h3>
                <p className="text-sm text-gray-600 font-mono">{course.slug}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(course.slug)}
                  className="text-sm text-purple-600 hover:text-purple-700"
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
                <p>Course ID: {course.id}</p>
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
                  onClick={() => onEdit(course)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Edit this course
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onBack}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Back to all courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Additional Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onEdit(course)}
            className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Course
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
            Share Course
          </button>
          {course.videoDemoUrl && (
            <a
              href={course.videoDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
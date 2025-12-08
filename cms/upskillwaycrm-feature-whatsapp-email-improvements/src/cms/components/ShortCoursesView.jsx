import { ArrowLeft, Edit3, Trash2, BookOpen, DollarSign, Video, Calendar, User, Tag, FileText } from "lucide-react";

const ShortCoursesView = ({ course, onEdit, onDelete, onBack }) => {
  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Short course not found</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Archived" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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

  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(course.videoDemoUrl);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Short Course Details</h1>
            <p className="text-gray-600">View course information and content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(course)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">{course.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(course.status)}
                <span className="text-sm text-gray-500">
                  Slug: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{course.slug}</code>
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(course.price)}
              </div>
              <div className="text-sm text-gray-500">Course Price</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          {/* Demo Video */}
          {course.videoDemoUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                Demo Video
              </h3>
              {videoId ? (
                <div className="aspect-video w-full max-w-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Course Demo Video"
                    className="w-full h-full rounded-lg border border-gray-200"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Video URL</span>
                  </div>
                  <a
                    href={course.videoDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {course.videoDemoUrl}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Syllabus */}
          {course.syllabus && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Syllabus</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {course.syllabus}
                </pre>
              </div>
            </div>
          )}

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                Tags ({course.tags.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Course Information Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Price</span>
                </div>
                <span className="text-2xl font-bold text-green-900">
                  {formatCurrency(course.price)}
                </span>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Course Type</span>
                </div>
                <span className="text-lg font-semibold text-blue-900">
                  Short Course
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(course.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Updated:</span>
                <span className="font-medium">{formatDate(course.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Course ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {course.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{course.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortCoursesView;
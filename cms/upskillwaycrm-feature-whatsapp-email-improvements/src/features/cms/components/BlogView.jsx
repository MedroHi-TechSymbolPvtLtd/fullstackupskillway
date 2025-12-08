// BlogView component
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  Eye,
  ExternalLink,
  Share2
} from 'lucide-react';

const BlogView = ({ blog, onEdit, onDelete, onBack }) => {
  if (!blog) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Blog not found</h3>
          <p className="text-gray-500">The blog post you're looking for doesn't exist.</p>
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
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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
          Back to Blogs
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
            onClick={() => onEdit(blog)}
            className="flex items-center px-4 py-2 text-orange-600 hover:text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(blog.id)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={blog.imageUrl} 
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(blog.createdAt)}</span>
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated: {formatDate(blog.updatedAt)}</span>
                </div>
              )}
              {blog.creator && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{blog.creator.name || 'Unknown Author'}</span>
                </div>
              )}
            </div>
            {getStatusBadge(blog.status)}
          </div>

          {/* Title and Excerpt */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="flex items-center text-sm text-gray-500 mr-2">
                <Tag className="h-4 w-4 mr-1" />
                Tags:
              </div>
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Slug Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">URL Slug</h3>
                <p className="text-sm text-gray-600 font-mono">{blog.slug}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(blog.slug)}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Copy
                </button>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {blog.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Blog ID: {blog.id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onEdit(blog)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Edit this post
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onBack}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Back to all posts
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
            onClick={() => onEdit(blog)}
            className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Post
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Post
          </button>
          <button
            onClick={() => {
              const newStatus = blog.status === 'published' ? 'draft' : 'published';
              // You could implement a quick status toggle here
              console.log(`Toggle status to: ${newStatus}`);
            }}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Eye className="h-5 w-5 mr-2" />
            {blog.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
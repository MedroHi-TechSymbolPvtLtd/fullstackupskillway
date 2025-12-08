import { ArrowLeft, Edit3, Trash2, MapPin, DollarSign, GraduationCap, Calendar, User } from "lucide-react";

const StudyAbroadView = ({ record, onEdit, onDelete, onBack }) => {
  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Study abroad record not found</p>
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
            <h1 className="text-2xl font-bold text-gray-900">Study Abroad Details</h1>
            <p className="text-gray-600">View study abroad destination information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(record)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Featured Image */}
        {record.imageUrl && (
          <div className="aspect-video w-full">
            <img
              src={record.imageUrl}
              alt={record.city}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">{record.city}</h2>
              </div>
              {getStatusBadge(record.status)}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {record.description}
            </p>
          </div>

          {/* Universities */}
          {record.universities && record.universities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Universities ({record.universities.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {record.universities.map((university, index) => (
                  <div
                    key={index}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <span className="text-green-800 font-medium">{university}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Average Tuition</span>
                </div>
                <span className="text-2xl font-bold text-blue-900">
                  {formatCurrency(record.avgTuition)}
                </span>
                <p className="text-sm text-blue-700 mt-1">per year</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Living Cost</span>
                </div>
                <span className="text-2xl font-bold text-green-900">
                  {formatCurrency(record.livingCost)}
                </span>
                <p className="text-sm text-green-700 mt-1">per year</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Total Estimated Cost</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(parseInt(record.avgTuition) + parseInt(record.livingCost))}
              </span>
              <p className="text-sm text-gray-700 mt-1">per year (tuition + living)</p>
            </div>
          </div>

          {/* Tags */}
          {record.tags && record.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {record.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(record.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Updated:</span>
                <span className="font-medium">{formatDate(record.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {record.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyAbroadView;
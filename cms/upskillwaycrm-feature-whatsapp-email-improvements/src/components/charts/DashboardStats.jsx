import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Blog Stats */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Blog Content</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{stats.blogs.total}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Published</span>
              <span className="font-semibold text-green-600">{stats.blogs.published}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Draft</span>
              <span className="font-semibold text-yellow-600">{stats.blogs.draft}</span>
            </div>
          </div>
        </div>

        {/* Video Stats */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-700">Video Content</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{stats.videos.total}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Published</span>
              <span className="font-semibold text-green-600">{stats.videos.published}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Draft</span>
              <span className="font-semibold text-yellow-600">{stats.videos.draft}</span>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Course Content</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{stats.courses.total}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">{stats.courses.active}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Inactive</span>
              <span className="font-semibold text-yellow-600">{stats.courses.inactive}</span>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-700">Sales Management</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{stats.users.total}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">{stats.users.active}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Inactive</span>
              <span className="font-semibold text-yellow-600">{stats.users.inactive}</span>
            </div>
          </div>
        </div>

        {/* Lead Stats */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-700">Lead Management</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{stats.leads.total}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">New</span>
              <span className="font-semibold text-green-600">{stats.leads.new}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Contacted</span>
              <span className="font-semibold text-yellow-600">{stats.leads.contacted}</span>
            </div>
          </div>
        </div>

        {/* View Stats */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-700">Content Views</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Views</span>
              <span className="font-semibold">{stats.views.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">This Month</span>
              <div className="flex items-center">
                <span className="font-semibold text-green-600 mr-1">{stats.views.thisMonth.toLocaleString()}</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Growth</span>
              <div className="flex items-center">
                <span className="font-semibold text-green-600 mr-1">+12.5%</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
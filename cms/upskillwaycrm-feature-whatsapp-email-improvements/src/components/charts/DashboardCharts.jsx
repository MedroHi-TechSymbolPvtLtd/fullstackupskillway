import React from 'react';
import { 
  TrendingUp
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Sales Funnel Line Chart Component
export const LeadConversionChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Ensure data exists and has required properties
  if (!data) {
    console.warn('⚠️ LeadConversionChart: No data provided');
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No conversion data available</p>
        </div>
      </div>
    );
  }

  // Safely extract values with defaults
  const totalLeads = data.total || 0;
  const newLeads = data.new || 0;
  const qualifiedLeads = data.qualified || 0;
  const convertedLeads = data.converted || 0;
  const conversionRate = data.conversionRate || '0.0';

  console.log('📊 LeadConversionChart received data:', {
    total: totalLeads,
    new: newLeads,
    qualified: qualifiedLeads,
    converted: convertedLeads,
    conversionRate
  });

  // Prepare line chart data showing conversion funnel as a trend
  const lineData = [
    { stage: 'Total Leads', value: totalLeads, percentage: 100 },
    { stage: 'New Leads', value: newLeads, percentage: totalLeads > 0 ? ((newLeads / totalLeads) * 100) : 0 },
    { stage: 'Qualified', value: qualifiedLeads, percentage: totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100) : 0 },
    { stage: 'Converted', value: convertedLeads, percentage: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100) : 0 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-gray-900">Sales Funnel Trend (Real-Time)</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">LIVE</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-purple-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="stage" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8B5CF6" 
              strokeWidth={4}
              name="Lead Count"
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 3, fill: '#fff' }}
              strokeDasharray="0"
            />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Percentage (%)"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 3, fill: '#fff' }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 text-center">
        {lineData.map((stage) => (
          <div key={stage.stage} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{stage.stage}</p>
            <p className="text-lg font-bold text-gray-900">{stage.value}</p>
            <p className="text-xs text-gray-500">{stage.percentage.toFixed(1)}%</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Qualification Rate</p>
            <p className="text-lg font-semibold text-blue-600">
              {totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-lg font-semibold text-green-600">{conversionRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CRM Metrics Real-Time Line Chart Component
export const CRMMetricsChart = ({ data, loading = false }) => {
  // Debug logging
  console.log('📊 CRMMetricsChart received:', {
    data,
    dataType: typeof data,
    isArray: Array.isArray(data),
    dataLength: Array.isArray(data) ? data.length : 'N/A',
    loading
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Ensure data exists and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('⚠️ CRMMetricsChart: No valid data provided', {
      data,
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : 'N/A'
    });
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No CRM metrics data available</p>
          <p className="text-xs text-gray-400 mt-2">Data: {JSON.stringify(data)}</p>
        </div>
      </div>
    );
  }

  // Validate data structure
  const validData = data.filter(item => 
    item && 
    typeof item === 'object' && 
    'month' in item &&
    ('leads' in item || 'colleges' in item || 'trainers' in item)
  );

  if (validData.length === 0) {
    console.warn('⚠️ CRMMetricsChart: No valid data items found', {
      originalData: data,
      validDataCount: validData.length
    });
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Invalid CRM metrics data format</p>
          <p className="text-xs text-gray-400 mt-2">Expected: Array of {month, leads, colleges, trainers}</p>
        </div>
      </div>
    );
  }

  console.log('✅ CRMMetricsChart: Valid data items:', validData.length, 'of', data.length);

  // Calculate current totals for display
  const currentMonth = validData.length > 0 ? validData[validData.length - 1] : { leads: 0, colleges: 0, trainers: 0 };
  const previousMonth = validData.length > 1 ? validData[validData.length - 2] : { leads: 0, colleges: 0, trainers: 0 };
  
  console.log('📊 CRMMetricsChart: Current month data:', currentMonth);
  console.log('📊 CRMMetricsChart: Previous month data:', previousMonth);
  
  // Calculate growth rates
  const leadsGrowth = previousMonth.leads > 0 ? (((currentMonth.leads - previousMonth.leads) / previousMonth.leads) * 100).toFixed(1) : '0.0';
  const collegesGrowth = previousMonth.colleges > 0 ? (((currentMonth.colleges - previousMonth.colleges) / previousMonth.colleges) * 100).toFixed(1) : '0.0';
  const trainersGrowth = previousMonth.trainers > 0 ? (((currentMonth.trainers - previousMonth.trainers) / previousMonth.trainers) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-gray-900">CRM Metrics Over Time</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">LIVE DATA</span>
            <div className="text-xs text-gray-500">
              Updates every 10s
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Last Update</p>
          <p className="text-sm font-medium text-gray-700">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={validData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#3B82F6" 
              strokeWidth={4}
              name="Leads"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 3, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="colleges" 
              stroke="#10B981" 
              strokeWidth={4}
              name="Colleges"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 3, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="trainers" 
              stroke="#8B5CF6" 
              strokeWidth={4}
              name="Trainers"
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#8B5CF6', strokeWidth: 3, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Real-time Summary stats with live growth indicators */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current Month Leads</p>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {currentMonth.leads}
          </p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${leadsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs font-medium ${leadsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {leadsGrowth >= 0 ? '+' : ''}{leadsGrowth}% vs last month
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total: {data.reduce((sum, item) => sum + item.leads, 0)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current Month Colleges</p>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {currentMonth.colleges}
          </p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${collegesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs font-medium ${collegesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {collegesGrowth >= 0 ? '+' : ''}{collegesGrowth}% vs last month
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total: {data.reduce((sum, item) => sum + item.colleges, 0)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current Month Trainers</p>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {currentMonth.trainers}
          </p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${trainersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs font-medium ${trainersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trainersGrowth >= 0 ? '+' : ''}{trainersGrowth}% vs last month
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total: {data.reduce((sum, item) => sum + item.trainers, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Content Analytics Chart Component using Recharts
export const ContentAnalyticsChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-gray-900">Content Analytics</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-purple-600 font-medium">LIVE DATA</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="blogs" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Blogs"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="videos" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Videos"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="courses" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Courses"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="ebooks" 
              stroke="#F59E0B" 
              strokeWidth={3}
              name="E-books"
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Real-time Summary stats */}
      <div className="mt-6 grid grid-cols-4 gap-3 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Blogs</p>
          <p className="text-xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.blogs, 0)}
          </p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+18%</span>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Videos</p>
          <p className="text-xl font-bold text-red-600">
            {data.reduce((sum, item) => sum + item.videos, 0)}
          </p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+25%</span>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Courses</p>
          <p className="text-xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.courses, 0)}
          </p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+22%</span>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total E-books</p>
          <p className="text-xl font-bold text-yellow-600">
            {data.reduce((sum, item) => sum + item.ebooks, 0)}
          </p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+20%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lead Source Trends Line Chart Component
export const LeadSourceChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Convert lead source data to line chart format showing trends
  const lineData = data.map((item, index) => ({
    source: item.source,
    count: item.count,
    percentage: parseFloat(item.percentage),
    trend: index + 1 // Simple trend simulation
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-gray-900">Lead Sources Performance</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-orange-600 font-medium">REAL-TIME</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Leads</p>
          <p className="text-2xl font-bold text-purple-600">
            {data.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="source" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3B82F6" 
              strokeWidth={4}
              name="Lead Count"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#F59E0B" 
              strokeWidth={3}
              name="Percentage"
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#F59E0B', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {lineData.map((item) => (
          <div key={item.source} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{item.source}</p>
            <p className="text-lg font-bold text-gray-900">{item.count}</p>
            <p className="text-xs text-gray-500">{item.percentage}%</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Top Source</p>
            <p className="text-lg font-semibold text-blue-600">
              {data.length > 0 ? data[0].source : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Top Source %</p>
            <p className="text-lg font-semibold text-green-600">
              {data.length > 0 ? data[0].percentage : '0'}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

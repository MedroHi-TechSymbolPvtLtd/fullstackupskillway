import React from 'react';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

const CRMCharts = ({ stats, recentData = {} }) => {
  // Generate mock data for charts if not provided
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      leads: Math.floor(Math.random() * 20) + 10,
      colleges: Math.floor(Math.random() * 5) + 2,
      trainers: Math.floor(Math.random() * 8) + 5,
      revenue: Math.floor(Math.random() * 50000) + 10000
    }));
  };

  const chartData = recentData.chartData || generateChartData();

  // Lead Conversion Chart Component
  const LeadConversionChart = () => {
    const maxValue = Math.max(...chartData.map(d => d.leads));
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Lead Conversion Trends</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">New Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Converted</span>
            </div>
          </div>
        </div>

        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-end w-full">
                <span>{Math.round((maxValue / 5) * (5 - i))}</span>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="absolute left-12 right-0 top-0 bottom-0">
            {/* Horizontal grid lines */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${(i * 100) / 5}%` }}
              ></div>
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end">
              {chartData.map((data, index) => {
                const barWidth = `${100 / chartData.length / 2}%`;
                const spacing = `${100 / chartData.length}%`;
                
                return (
                  <div 
                    key={data.month} 
                    className="flex items-end justify-center"
                    style={{ width: spacing }}
                  >
                    {/* New leads bar */}
                    <div 
                      className="bg-blue-500 rounded-t mx-px" 
                      style={{ 
                        height: `${(data.leads / maxValue) * 100}%`,
                        width: barWidth
                      }}
                    ></div>
                    
                    {/* Converted leads bar (estimated 30% conversion) */}
                    <div 
                      className="bg-green-500 rounded-t mx-px" 
                      style={{ 
                        height: `${((data.leads * 0.3) / maxValue) * 100}%`,
                        width: barWidth
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 transform translate-y-6 flex justify-between">
              {chartData.map(data => (
                <div key={data.month} className="text-xs text-gray-500">
                  {data.month}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Total Leads</p>
            <p className="font-semibold text-blue-600">
              {chartData.reduce((sum, data) => sum + data.leads, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Converted</p>
            <p className="font-semibold text-green-600">
              {Math.round(chartData.reduce((sum, data) => sum + data.leads, 0) * 0.3)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Conversion Rate</p>
            <p className="font-semibold text-purple-600">30%</p>
          </div>
        </div>
      </div>
    );
  };

  // Revenue Growth Chart Component
  const RevenueChart = () => {
    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
        </div>

        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-end w-full">
                <span>${Math.round((maxRevenue / 5) * (5 - i) / 1000)}k</span>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="absolute left-20 right-0 top-0 bottom-0">
            {/* Horizontal grid lines */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${(i * 100) / 5}%` }}
              ></div>
            ))}

            {/* Line chart */}
            <div className="absolute inset-0">
              <svg className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points={chartData.map((data, index) => {
                    const x = (index / (chartData.length - 1)) * 100;
                    const y = 100 - (data.revenue / maxRevenue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {chartData.map((data, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - (data.revenue / maxRevenue) * 100;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3B82F6"
                      className="hover:r-6 transition-all"
                    />
                  );
                })}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 transform translate-y-6 flex justify-between">
              {chartData.map(data => (
                <div key={data.month} className="text-xs text-gray-500">
                  {data.month}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Total Revenue</p>
            <p className="font-semibold text-green-600">
              ${chartData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Average Monthly</p>
            <p className="font-semibold text-blue-600">
              ${Math.round(chartData.reduce((sum, data) => sum + data.revenue, 0) / chartData.length).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Partnership Status Chart Component
  const PartnershipChart = () => {
    const partnershipData = [
      { name: 'Active Colleges', value: stats.colleges.active, color: 'bg-green-500' },
      { name: 'Inactive Colleges', value: stats.colleges.inactive, color: 'bg-gray-400' },
      { name: 'Available Trainers', value: stats.trainers.available, color: 'bg-blue-500' },
      { name: 'Busy Trainers', value: stats.trainers.busy, color: 'bg-yellow-500' }
    ];

    const total = partnershipData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Partnership Status</h3>
        
        <div className="space-y-4">
          {partnershipData.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% of total
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Total Partnerships</p>
              <p className="font-semibold text-purple-600">{stats.colleges.total}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Total Trainers</p>
              <p className="font-semibold text-blue-600">{stats.trainers.total}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <LeadConversionChart />
      </div>
      <RevenueChart />
      <PartnershipChart />
    </div>
  );
};

export default CRMCharts;


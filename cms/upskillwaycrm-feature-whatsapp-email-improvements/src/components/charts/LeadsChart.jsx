import React from 'react';

const LeadsChart = () => {
  // Mock data for the chart
  const leadsData = [
    { month: 'Jan', new: 12, contacted: 8, converted: 3 },
    { month: 'Feb', new: 15, contacted: 10, converted: 5 },
    { month: 'Mar', new: 18, contacted: 14, converted: 7 },
    { month: 'Apr', new: 22, contacted: 17, converted: 8 },
    { month: 'May', new: 19, contacted: 15, converted: 6 },
    { month: 'Jun', new: 23, contacted: 18, converted: 9 },
  ];

  // Calculate the maximum value for scaling
  const maxValue = Math.max(
    ...leadsData.map(d => Math.max(d.new, d.contacted, d.converted))
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">New</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Contacted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Converted</span>
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
            {leadsData.map((data, index) => {
              const barWidth = `${100 / leadsData.length / 1.5}%`;
              const spacing = `${100 / leadsData.length}%`;
              
              return (
                <div 
                  key={data.month} 
                  className="flex items-end justify-center"
                  style={{ width: spacing }}
                >
                  {/* New leads bar */}
                  <div 
                    className="bg-yellow-500 rounded-t mx-px" 
                    style={{ 
                      height: `${(data.new / maxValue) * 100}%`,
                      width: barWidth
                    }}
                  ></div>
                  
                  {/* Contacted leads bar */}
                  <div 
                    className="bg-blue-500 rounded-t mx-px" 
                    style={{ 
                      height: `${(data.contacted / maxValue) * 100}%`,
                      width: barWidth
                    }}
                  ></div>
                  
                  {/* Converted leads bar */}
                  <div 
                    className="bg-green-500 rounded-t mx-px" 
                    style={{ 
                      height: `${(data.converted / maxValue) * 100}%`,
                      width: barWidth
                    }}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute left-0 right-0 bottom-0 transform translate-y-6 flex justify-between">
            {leadsData.map(data => (
              <div key={data.month} className="text-xs text-gray-500">
                {data.month}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-600">
        <h3 className="font-medium mb-2">Lead Conversion Summary</h3>
        <p>Total new leads this quarter: {leadsData.reduce((sum, data) => sum + data.new, 0)}</p>
        <p>Average conversion rate: {Math.round((leadsData.reduce((sum, data) => sum + data.converted, 0) / leadsData.reduce((sum, data) => sum + data.new, 0)) * 100)}%</p>
      </div>
    </div>
  );
};

export default LeadsChart;
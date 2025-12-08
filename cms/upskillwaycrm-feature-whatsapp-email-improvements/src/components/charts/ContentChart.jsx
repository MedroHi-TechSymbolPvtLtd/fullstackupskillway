import React from 'react';

const ContentChart = () => {
  // Mock data for the chart
  const contentData = [
    { month: 'Jan', blogs: 5, videos: 2, courses: 0 },
    { month: 'Feb', blogs: 7, videos: 3, courses: 1 },
    { month: 'Mar', blogs: 10, videos: 4, courses: 1 },
    { month: 'Apr', blogs: 8, videos: 5, courses: 2 },
    { month: 'May', blogs: 12, videos: 7, courses: 2 },
    { month: 'Jun', blogs: 15, videos: 9, courses: 3 },
  ];

  // Calculate the maximum value for scaling
  const maxValue = Math.max(
    ...contentData.map(d => Math.max(d.blogs, d.videos, d.courses))
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Blogs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Videos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Courses</span>
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
            {contentData.map((data, index) => {
              const barWidth = `${100 / contentData.length / 1.5}%`;
              const spacing = `${100 / contentData.length}%`;
              
              return (
                <div 
                  key={data.month} 
                  className="flex items-end justify-center"
                  style={{ width: spacing }}
                >
                  {/* Blog bar */}
                  <div 
                    className="bg-blue-500 rounded-t mx-px" 
                    style={{ 
                      height: `${(data.blogs / maxValue) * 100}%`,
                      width: barWidth
                    }}
                  ></div>
                  
                  {/* Video bar */}
                  <div 
                    className="bg-red-500 rounded-t mx-px" 
                    style={{ 
                      height: `${(data.videos / maxValue) * 100}%`,
                      width: barWidth
                    }}
                  ></div>
                  
                  {/* Course bar */}
                  <div 
                    className="bg-green-500 rounded-t mx-px" 
                    style={{ 
                      height: `${(data.courses / maxValue) * 100}%`,
                      width: barWidth
                    }}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute left-0 right-0 bottom-0 transform translate-y-6 flex justify-around text-xs text-gray-500">
            {contentData.map(data => (
              <div key={data.month}>{data.month}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentChart;
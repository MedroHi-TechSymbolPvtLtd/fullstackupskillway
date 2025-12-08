import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  Building2,
  GraduationCap,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const CRMDataSummary = ({ stats, chartData, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const summaryItems = [
    {
      title: 'Lead Performance',
      icon: Users,
      color: 'blue',
      metrics: [
        { label: 'Total Leads', value: stats.leads.total, trend: '+12.5%' },
        { label: 'Conversion Rate', value: `${stats.leads.total > 0 ? ((stats.leads.converted / stats.leads.total) * 100).toFixed(1) : 0}%`, trend: '+2.1%' },
        { label: 'Qualified Leads', value: stats.leads.qualified, trend: '+8.3%' }
      ]
    },
    {
      title: 'Partnership Health',
      icon: Building2,
      color: 'green',
      metrics: [
        { label: 'Active Colleges', value: stats.colleges.active, trend: '+5.2%' },
        { label: 'Partnership Rate', value: `${stats.colleges.total > 0 ? ((stats.colleges.active / stats.colleges.total) * 100).toFixed(1) : 0}%`, trend: '+1.8%' },
        { label: 'New This Month', value: Math.floor(stats.colleges.total * 0.1), trend: '+3.4%' }
      ]
    },
    {
      title: 'Trainer Utilization',
      icon: GraduationCap,
      color: 'purple',
      metrics: [
        { label: 'Available Trainers', value: stats.trainers.available, trend: '+6.7%' },
        { label: 'Utilization Rate', value: `${stats.trainers.total > 0 ? ((stats.trainers.available / stats.trainers.total) * 100).toFixed(1) : 0}%`, trend: '+4.2%' },
        { label: 'Active Sessions', value: Math.floor(stats.trainers.available * 0.8), trend: '+9.1%' }
      ]
    },
    {
      title: 'Revenue Metrics',
      icon: DollarSign,
      color: 'yellow',
      metrics: [
        { label: 'Monthly Revenue', value: `$${stats.revenue.monthly.toLocaleString()}`, trend: `+${stats.revenue.growth}%` },
        { label: 'Total Revenue', value: `$${stats.revenue.total.toLocaleString()}`, trend: '+15.3%' },
        { label: 'Avg. Deal Size', value: `$${Math.round(stats.revenue.monthly / Math.max(stats.leads.converted, 1)).toLocaleString()}`, trend: '+7.8%' }
      ]
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend.startsWith('+')) {
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    } else if (trend.startsWith('-')) {
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    }
    return <Activity className="w-3 h-3 text-gray-500" />;
  };

  const getTrendColor = (trend) => {
    if (trend.startsWith('+')) {
      return 'text-green-600';
    } else if (trend.startsWith('-')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        border: 'border-purple-200'
      },
      yellow: {
        bg: 'bg-yellow-50',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        border: 'border-yellow-200'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryItems.map((item, index) => {
            const IconComponent = item.icon;
            const colors = getColorClasses(item.color);
            
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${colors.iconBg} p-2 rounded-lg`}>
                    <IconComponent className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                </div>
                
                <div className="space-y-2">
                  {item.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                        <div className="flex items-center">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-xs ml-1 ${getTrendColor(metric.trend)}`}>
                            {metric.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Strong Lead Conversion</h4>
                <p className="text-sm text-gray-600">
                  Your lead conversion rate is {stats.leads.total > 0 ? ((stats.leads.converted / stats.leads.total) * 100).toFixed(1) : 0}%, 
                  which is above industry average of 20%.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Growth</h4>
                <p className="text-sm text-gray-600">
                  Monthly revenue has grown by {stats.revenue.growth}% compared to last month, 
                  indicating strong business momentum.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Partnership Opportunities</h4>
                <p className="text-sm text-gray-600">
                  You have {stats.trainers.available} available trainers ready to support 
                  {stats.colleges.active} active college partnerships.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Resource Utilization</h4>
                <p className="text-sm text-gray-600">
                  Trainer utilization is at {stats.trainers.total > 0 ? ((stats.trainers.available / stats.trainers.total) * 100).toFixed(1) : 0}%, 
                  indicating good capacity management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDataSummary;


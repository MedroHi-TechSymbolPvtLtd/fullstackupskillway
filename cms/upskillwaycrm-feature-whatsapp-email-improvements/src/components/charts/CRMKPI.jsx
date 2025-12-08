import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  GraduationCap, 
  DollarSign,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CRMKPI = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Lead Conversion Rate',
      value: stats.leads.total > 0 ? ((stats.leads.converted / stats.leads.total) * 100).toFixed(1) : 0,
      unit: '%',
      icon: Target,
      color: 'blue',
      trend: stats.leads.converted > 0 ? 'up' : 'neutral',
      trendValue: '+5.2%',
      description: 'Leads converted to customers',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Active Partnerships',
      value: stats.colleges.active,
      unit: '',
      icon: Building2,
      color: 'green',
      trend: stats.colleges.active > 0 ? 'up' : 'neutral',
      trendValue: '+2',
      description: 'Active college partnerships',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Trainer Utilization',
      value: stats.trainers.total > 0 ? ((stats.trainers.available / stats.trainers.total) * 100).toFixed(1) : 0,
      unit: '%',
      icon: GraduationCap,
      color: 'purple',
      trend: stats.trainers.available > stats.trainers.busy ? 'up' : 'down',
      trendValue: '+8.1%',
      description: 'Available trainers',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Monthly Revenue',
      value: stats.revenue.monthly,
      unit: '$',
      icon: DollarSign,
      color: 'yellow',
      trend: stats.revenue.growth > 0 ? 'up' : 'down',
      trendValue: `+${stats.revenue.growth}%`,
      description: 'This month\'s revenue',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <div key={index} className={`${kpi.bgColor} rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {kpi.unit === '$' ? kpi.value.toLocaleString() : kpi.value}
                  </p>
                  {kpi.unit && kpi.unit !== '$' && (
                    <span className="text-lg text-gray-500">{kpi.unit}</span>
                  )}
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="flex items-center">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm font-medium ml-1 ${getTrendColor(kpi.trend)}`}>
                      {kpi.trendValue}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
              </div>
              <div className={`${kpi.iconBg} p-3 rounded-full`}>
                <IconComponent className={`w-6 h-6 ${kpi.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CRMKPI;


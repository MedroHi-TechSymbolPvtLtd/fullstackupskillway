import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  RefreshCw,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import leadsApi from '../../services/api/leadsApi';
import LoadingSpinner from '../common/LoadingSpinner';

const LeadFunnelStats = ({ onStageClick }) => {
  const [funnelData, setFunnelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFunnelStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getFunnelStats();
      
      if (response.success) {
        setFunnelData(response.data);
      } else {
        console.warn('Funnel stats API not available, using mock data');
        setFunnelData(getMockFunnelData());
      }
    } catch (error) {
      console.warn('Error fetching funnel stats, using mock data:', error.message);
      setFunnelData(getMockFunnelData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunnelStats();
  }, [fetchFunnelStats]);

  const getMockFunnelData = () => {
    return {
      totalLeads: 9,
      conversionRate: 22.2,
      funnelData: [
        {
          stage: 'START',
          count: 9,
          percentage: 100
        },
        {
          stage: 'IN_CONVERSATION',
          count: 7,
          percentage: 77.8
        },
        {
          stage: 'EMAIL_WHATSAPP',
          count: 5,
          percentage: 55.6
        },
        {
          stage: 'IN_PROGRESS',
          count: 3,
          percentage: 33.3
        },
        {
          stage: 'CONVERT',
          count: 2,
          percentage: 22.2
        },
        {
          stage: 'DENIED',
          count: 1,
          percentage: 11.1
        }
      ]
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFunnelStats();
    setRefreshing(false);
  };

  const stageConfig = {
    START: {
      label: 'Start',
      color: 'bg-blue-100 text-blue-800',
      icon: Clock,
      description: 'Initial stage - processing started'
    },
    IN_CONVERSATION: {
      label: 'In Conversation',
      color: 'bg-purple-100 text-purple-800',
      icon: Users,
      description: 'Lead is in active conversation'
    },
    EMAIL_WHATSAPP: {
      label: 'Email/WhatsApp',
      color: 'bg-green-100 text-green-800',
      icon: Clock,
      description: 'Lead contacted via email or WhatsApp'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      color: 'bg-orange-100 text-orange-800',
      icon: Clock,
      description: 'Lead is actively being processed'
    },
    CONVERT: {
      label: 'Convert',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      description: 'Successfully converted to customer'
    },
    DENIED: {
      label: 'Denied',
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle,
      description: 'Lead declined or rejected'
    }
  };

  const calculateConversionRate = (stage, index, funnelData) => {
    if (!funnelData || !funnelData.funnelData || index === 0) return 100;
    
    const currentCount = stage.count;
    const previousCount = funnelData.funnelData[index - 1]?.count || currentCount;
    
    if (previousCount === 0) return 0;
    return Math.round((currentCount / previousCount) * 100);
  };

  const getConversionRateColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!funnelData) {
    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-center py-8">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No funnel data available</h3>
          <p className="text-gray-500">Funnel statistics will appear here once leads are processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Lead Funnel Analytics</h2>
              <p className="text-sm text-gray-500">Track lead progression and conversion rates</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            title="Refresh funnel data"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900">{funnelData.totalLeads || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-900">
                  {funnelData.conversionRate || 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Active Stages</p>
                <p className="text-2xl font-bold text-purple-900">
                  {funnelData.funnelData?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Funnel</h3>
        
        {funnelData.funnelData && funnelData.funnelData.length > 0 ? (
          <div className="space-y-4">
            {funnelData.funnelData.map((stage, index) => {
              const config = stageConfig[stage.stage] || stageConfig.START;
              const StageIcon = config.icon || Clock;
              const conversionRate = calculateConversionRate(stage, index, funnelData);
              const isClickable = onStageClick && stage.count > 0;
              
              return (
                <div key={stage.stage} className="relative">
                  {/* Funnel Bar */}
                  <div 
                    className={`relative rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      isClickable 
                        ? 'hover:shadow-md hover:scale-[1.02]' 
                        : 'cursor-default'
                    }`}
                    onClick={() => isClickable && onStageClick(stage.stage)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.color} flex items-center justify-center`}>
                          <StageIcon className="h-6 w-6" />
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {config.label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {stage.count}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stage.percentage}% of total
                        </div>
                        {index > 0 && (
                          <div className={`text-sm font-medium ${getConversionRateColor(conversionRate)}`}>
                            {conversionRate}% conversion
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            stage.stage === 'CONVERT' ? 'bg-green-500' :
            stage.stage === 'DENIED' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${stage.percentage}%` }}
        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow to next stage */}
                  {index < funnelData.funnelData.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funnel data</h3>
            <p className="text-gray-500">Start creating leads to see funnel analytics.</p>
          </div>
        )}
      </div>

      {/* Conversion Insights */}
      {funnelData.funnelData && funnelData.funnelData.length > 1 && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Converting Stage */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Best Converting Stage</h4>
              {(() => {
                const bestStage = funnelData.funnelData.reduce((best, current, index) => {
                  const currentRate = calculateConversionRate(current, index, funnelData);
                  const bestRate = calculateConversionRate(best, funnelData.funnelData.indexOf(best), funnelData);
                  return currentRate > bestRate ? current : best;
                });
                const bestRate = calculateConversionRate(bestStage, funnelData.funnelData.indexOf(bestStage), funnelData);
                const config = stageConfig[bestStage.stage] || stageConfig.START;
                
                return (
                  <div>
                    <p className="text-green-800 font-medium">{config.label}</p>
                    <p className="text-green-600 text-sm">{bestRate}% conversion rate</p>
                  </div>
                );
              })()}
            </div>
            
            {/* Bottleneck Stage */}
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Potential Bottleneck</h4>
              {(() => {
                const worstStage = funnelData.funnelData.reduce((worst, current, index) => {
                  const currentRate = calculateConversionRate(current, index, funnelData);
                  const worstRate = calculateConversionRate(worst, funnelData.funnelData.indexOf(worst), funnelData);
                  return currentRate < worstRate ? current : worst;
                });
                const worstRate = calculateConversionRate(worstStage, funnelData.funnelData.indexOf(worstStage), funnelData);
                const config = stageConfig[worstStage.stage] || stageConfig.START;
                
                return (
                  <div>
                    <p className="text-red-800 font-medium">{config.label}</p>
                    <p className="text-red-600 text-sm">{worstRate}% conversion rate</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFunnelStats;

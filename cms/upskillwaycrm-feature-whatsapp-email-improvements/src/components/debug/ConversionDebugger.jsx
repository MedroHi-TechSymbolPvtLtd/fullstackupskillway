import React, { useState } from 'react';
import { Bug, Play, Trash2, Eye, RefreshCw } from 'lucide-react';
import crmService from '../../services/crmService';
import collegesApi from '../../services/api/collegesApi';
import toastUtils from '../../utils/toastUtils';

const ConversionDebugger = () => {
  const [debugLog, setDebugLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, { timestamp, message, type }]);
    console.log(`[${timestamp}] ${message}`);
  };

  const clearLogs = () => {
    setDebugLog([]);
    console.clear();
  };

  const checkLocalStorage = () => {
    addLog('🔍 Checking localStorage...', 'info');
    
    // Check CRM data
    const crmData = localStorage.getItem('crm-data');
    addLog(`📦 CRM Data: ${crmData ? 'Found' : 'Not found'}`, crmData ? 'success' : 'warning');
    if (crmData) {
      const parsed = JSON.parse(crmData);
      addLog(`📦 CRM Leads: ${parsed.leads?.length || 0}`, 'info');
    }
    
    // Check colleges data
    const collegesData = localStorage.getItem('colleges-data');
    addLog(`📦 Colleges Data: ${collegesData ? 'Found' : 'Not found'}`, collegesData ? 'success' : 'warning');
    if (collegesData) {
      const parsed = JSON.parse(collegesData);
      addLog(`📦 Total Colleges: ${parsed.length}`, 'info');
      const converted = parsed.filter(c => c.sourceLeadId);
      addLog(`📦 Converted Colleges: ${converted.length}`, converted.length > 0 ? 'success' : 'warning');
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    clearLogs();
    
    try {
      addLog('🧪 Starting full conversion test...', 'info');
      
      // Step 1: Create test lead
      addLog('📝 Step 1: Creating test lead...', 'info');
      const testLead = {
        id: Date.now(),
        name: 'Debug Test Lead',
        email: 'debug@test.com',
        phone: '+1234567890',
        organization: 'Debug Test University',
        requirement: 'Testing lead conversion functionality',
        source: 'Debug',
        status: 'QUALIFIED',
        stage: 'QUALIFIED',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedCollegeId: null,
        conversionDate: null
      };
      
      // Store in localStorage
      const crmData = JSON.parse(localStorage.getItem('crm-data') || '{"leads": [], "colleges": [], "trainers": [], "users": []}');
      crmData.leads.push(testLead);
      localStorage.setItem('crm-data', JSON.stringify(crmData));
      addLog(`✅ Test lead created with ID: ${testLead.id}`, 'success');
      
      // Step 2: Convert the lead
      addLog('🔄 Step 2: Converting lead to CONVERTED status...', 'info');
      const conversionResult = await crmService.updateLeadStatus(testLead.id, 'CONVERTED');
      addLog(`📊 Conversion result: ${JSON.stringify(conversionResult)}`, conversionResult.success ? 'success' : 'error');
      
      // Step 3: Check if college was created
      addLog('🏫 Step 3: Checking for created college...', 'info');
      const collegesResponse = await collegesApi.getAllColleges({ limit: 100 });
      addLog(`📊 Colleges API response: ${JSON.stringify(collegesResponse)}`, 'info');
      
      if (collegesResponse.success) {
        const colleges = collegesResponse.data || [];
        addLog(`📊 Total colleges found: ${colleges.length}`, 'info');
        
        const testCollege = colleges.find(c => c.sourceLeadId === testLead.id);
        if (testCollege) {
          addLog(`🎉 SUCCESS: College created from lead!`, 'success');
          addLog(`🏫 College: ${testCollege.name} (ID: ${testCollege.id})`, 'success');
        } else {
          addLog(`❌ FAILURE: No college found for lead ${testLead.id}`, 'error');
          addLog(`📊 Available colleges: ${colleges.map(c => `${c.name} (sourceLeadId: ${c.sourceLeadId})`).join(', ')}`, 'info');
        }
      } else {
        addLog(`❌ Failed to fetch colleges: ${collegesResponse.message}`, 'error');
      }
      
      // Step 4: Check localStorage directly
      addLog('📦 Step 4: Direct localStorage check...', 'info');
      checkLocalStorage();
      
      addLog('✅ Test completed!', 'success');
      
    } catch (error) {
      addLog(`❌ Test failed: ${error.message}`, 'error');
      console.error('Debug test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearAllData = () => {
    localStorage.removeItem('crm-data');
    localStorage.removeItem('colleges-data');
    localStorage.removeItem('lead_conversion_notifications');
    localStorage.removeItem('lead_conversion_audit');
    addLog('🧹 All localStorage data cleared', 'warning');
    toastUtils.info('All data cleared');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bug className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Conversion Debugger</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={runFullTest}
            disabled={isRunning}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Full Test
              </>
            )}
          </button>
          <button
            onClick={checkLocalStorage}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Check Storage
          </button>
          <button
            onClick={clearLogs}
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Logs
          </button>
          <button
            onClick={clearAllData}
            className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
        <div className="font-mono text-sm space-y-1">
          {debugLog.length === 0 ? (
            <div className="text-gray-400">No logs yet. Click "Run Full Test" to start debugging.</div>
          ) : (
            debugLog.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-gray-300'
                }`}
              >
                <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Click "Run Full Test" to create a test lead and convert it</li>
          <li>Watch the logs to see each step of the conversion process</li>
          <li>Check the browser console for additional detailed logs</li>
          <li>Use "Check Storage" to inspect localStorage contents</li>
          <li>Go to CRM → Colleges and click "Refresh" to see if colleges appear</li>
        </ol>
      </div>
    </div>
  );
};

export default ConversionDebugger;
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Building, User, Mail, Phone } from 'lucide-react';
import crmService from '../../services/crmService';
import toastUtils from '../../utils/toastUtils';
import ConversionDebugger from '../debug/ConversionDebugger';

const LeadConversionDemo = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Demo lead data
  const demoLead = {
    id: 999, // Demo ID
    name: 'Demo Lead',
    email: 'demo@example.com',
    phone: '+1234567890',
    organization: 'Demo University',
    requirement: 'Need advanced programming courses for students',
    source: 'Demo',
    status: 'qualified'
  };

  const handleConvertLead = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Demo: Converting lead to college...');
      
      // Use the CRM service to update lead status to CONVERTED
      const conversionResult = await crmService.updateLeadStatus(demoLead.id, 'CONVERTED');
      
      console.log('🧪 Demo: Conversion result:', conversionResult);
      
      setResult(conversionResult);
      
      if (conversionResult.success) {
        if (conversionResult.conversionResult?.success) {
          const { isNewCollege, college } = conversionResult.conversionResult;
          const message = isNewCollege 
            ? `✅ Success! New college "${college.name}" created and linked to lead.`
            : `✅ Success! Lead linked to existing college "${college.name}".`;
          toastUtils.success(message);
        } else if (conversionResult.alreadyConverted) {
          toastUtils.info('ℹ️ Lead is already converted and linked to a college.');
        } else {
          toastUtils.success('✅ Lead status updated to converted!');
        }
      } else {
        toastUtils.error(`❌ Conversion failed: ${conversionResult.message}`);
      }
    } catch (error) {
      console.error('🧪 Demo: Conversion error:', error);
      setResult({
        success: false,
        error: error.message,
        message: `Conversion failed: ${error.message}`
      });
      toastUtils.error(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🧪 Lead to College Conversion Demo
          </h2>
          <p className="text-gray-600">
            Test the automatic lead-to-college conversion process. When a lead status is changed to "converted", 
            it will automatically create a college entry or link to an existing one.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demo Lead Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Demo Lead Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{demoLead.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium">Organization:</span>
                  <span className="ml-2">{demoLead.organization}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{demoLead.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{demoLead.phone}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Requirement:</span>
                  <p className="mt-1 text-gray-700">{demoLead.requirement}</p>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Current Status:</span>
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {demoLead.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion Process */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Conversion Process
              </h3>
              <div className="space-y-4">
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">What happens when you convert:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• ✅ Lead status changes to "converted"</li>
                    <li>• 🔍 System searches for existing college with name "{demoLead.organization}"</li>
                    <li>• 🏫 Creates new college OR links to existing one</li>
                    <li>• 📝 Maps lead contact info to college</li>
                    <li>• 🔗 Establishes bidirectional relationship</li>
                    <li>• 📊 Logs conversion for audit and analytics</li>
                  </ul>
                </div>

                <button
                  onClick={handleConvertLead}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Converting Lead...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Convert Lead to College</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Conversion Result */}
          {result && (
            <div className="mt-6">
              <div className={`rounded-lg p-4 ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.success ? 'Conversion Successful!' : 'Conversion Failed'}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </p>

                    {/* Detailed Result */}
                    {result.success && result.conversionResult && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Conversion Details:</h5>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><strong>Action:</strong> {result.conversionResult.isNewCollege ? 'Created new college' : 'Linked to existing college'}</p>
                          {result.conversionResult.college && (
                            <>
                              <p><strong>College Name:</strong> {result.conversionResult.college.name}</p>
                              <p><strong>College ID:</strong> {result.conversionResult.college.id}</p>
                              <p><strong>College Status:</strong> {result.conversionResult.college.status}</p>
                            </>
                          )}
                          <p><strong>Lead ID:</strong> {result.conversionResult.lead?.id}</p>
                          <p><strong>Linked College ID:</strong> {result.conversionResult.lead?.linkedCollegeId}</p>
                        </div>
                      </div>
                    )}

                    {/* Error Details */}
                    {!result.success && result.error && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Error Details:</h5>
                        <p className="text-sm text-red-600">{result.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">💡 How to Use in Real Application:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Go to <strong>CRM → Leads</strong> in the main navigation</p>
              <p>2. Find any lead and click the <strong>Update Status</strong> button (clock icon)</p>
              <p>3. Select <strong>"Convert"</strong> stage in the status update modal</p>
              <p>4. Click <strong>"Update Status"</strong> to trigger the conversion</p>
              <p>5. The system will automatically create/link a college and show success notification</p>
            </div>
          </div>

          {/* Debug Section */}
          <div className="mt-8">
            <ConversionDebugger />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadConversionDemo;
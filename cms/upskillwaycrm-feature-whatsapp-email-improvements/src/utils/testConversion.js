// Test utility for lead-to-college conversion
import crmService from '../services/crmService';
import collegesApi from '../services/api/collegesApi';

/**
 * Test the complete lead-to-college conversion process
 * This function creates a test lead and converts it to verify the process works
 */
export const testLeadToCollegeConversion = async () => {
  console.log('🧪 Starting Lead-to-College Conversion Test...');
  
  try {
    // Step 1: Create a test lead in localStorage
    const testLead = {
      id: Date.now(), // Unique ID
      name: 'Test Lead for Conversion',
      email: 'test@example.com',
      phone: '+1234567890',
      organization: 'Test University for Conversion',
      requirement: 'Need programming courses for students',
      source: 'Test',
      status: 'qualified',
      stage: 'QUALIFIED',
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedCollegeId: null,
      conversionDate: null
    };
    
    // Store the test lead in localStorage (simulating it exists)
    const crmData = JSON.parse(localStorage.getItem('crm-data') || '{"leads": [], "colleges": [], "trainers": [], "users": []}');
    crmData.leads.push(testLead);
    localStorage.setItem('crm-data', JSON.stringify(crmData));
    
    console.log('✅ Step 1: Test lead created:', testLead);
    
    // Step 2: Trigger the conversion using CRM service
    console.log('🔄 Step 2: Triggering conversion...');
    const conversionResult = await crmService.updateLeadStatus(testLead.id, 'CONVERTED');
    
    console.log('✅ Step 2: Conversion result:', conversionResult);
    
    // Step 3: Check if college was created
    console.log('🔄 Step 3: Checking if college was created...');
    const collegesResponse = await collegesApi.getAllColleges({ limit: 100 });
    
    console.log('✅ Step 3: Colleges response:', collegesResponse);
    
    // Find the college created from our test lead
    const createdCollege = collegesResponse.data?.find(college => 
      college.sourceLeadId === testLead.id || 
      college.name === testLead.organization
    );
    
    // Step 4: Verify the lead was updated with college link
    console.log('🔄 Step 4: Checking if lead was updated...');
    const updatedLeadResponse = await crmService.getLeadById(testLead.id);
    console.log('✅ Step 4: Updated lead:', updatedLeadResponse);
    
    if (createdCollege) {
      console.log('🎉 SUCCESS: College created from lead conversion!', createdCollege);
      
      // Verify the college has the correct data
      const expectedData = {
        name: testLead.organization,
        contactEmail: testLead.email,
        contactPhone: testLead.phone,
        sourceLeadId: testLead.id,
        status: 'ACTIVE'
      };
      
      console.log('🔍 Verifying college data:', expectedData);
      
      return {
        success: true,
        testLead,
        createdCollege,
        conversionResult,
        updatedLead: updatedLeadResponse?.data,
        verification: {
          nameMatch: createdCollege.name === expectedData.name,
          emailMatch: createdCollege.contactEmail === expectedData.contactEmail,
          phoneMatch: createdCollege.contactPhone === expectedData.contactPhone,
          sourceLeadMatch: createdCollege.sourceLeadId === expectedData.sourceLeadId,
          statusMatch: createdCollege.status === expectedData.status
        },
        message: `Successfully converted lead "${testLead.name}" to college "${createdCollege.name}"`
      };
    } else {
      console.log('❌ FAILURE: No college found after conversion');
      console.log('Available colleges:', collegesResponse.data);
      return {
        success: false,
        testLead,
        conversionResult,
        updatedLead: updatedLeadResponse?.data,
        availableColleges: collegesResponse.data,
        message: 'Conversion process completed but college not found in list'
      };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message,
      message: `Test failed: ${error.message}`
    };
  }
};

/**
 * Check localStorage for colleges created from conversions
 */
export const checkConvertedColleges = () => {
  console.log('🔍 Checking localStorage for converted colleges...');
  
  try {
    const collegesData = localStorage.getItem('colleges-data');
    const colleges = collegesData ? JSON.parse(collegesData) : [];
    
    console.log(`📦 Found ${colleges.length} colleges in localStorage:`, colleges);
    
    const convertedColleges = colleges.filter(college => college.sourceLeadId);
    console.log(`🔄 Found ${convertedColleges.length} colleges from conversions:`, convertedColleges);
    
    return {
      totalColleges: colleges.length,
      convertedColleges: convertedColleges.length,
      colleges: convertedColleges
    };
    
  } catch (error) {
    console.error('❌ Error checking converted colleges:', error);
    return {
      totalColleges: 0,
      convertedColleges: 0,
      colleges: []
    };
  }
};

/**
 * Clear test data from localStorage
 */
export const clearTestData = () => {
  console.log('🧹 Clearing test data...');
  
  try {
    // Clear colleges
    localStorage.removeItem('colleges-data');
    
    // Clear test leads from CRM data
    const crmData = JSON.parse(localStorage.getItem('crm-data') || '{"leads": [], "colleges": [], "trainers": [], "users": []}');
    crmData.leads = crmData.leads.filter(lead => !lead.name.includes('Test Lead'));
    localStorage.setItem('crm-data', JSON.stringify(crmData));
    
    // Clear notifications
    localStorage.removeItem('lead_conversion_notifications');
    localStorage.removeItem('lead_conversion_audit');
    
    console.log('✅ Test data cleared');
    
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
  }
};
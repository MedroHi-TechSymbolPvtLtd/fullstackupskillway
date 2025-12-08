// Quick test script to verify lead conversion works
import { testLeadToCollegeConversion, checkConvertedColleges } from './src/utils/testConversion.js';

console.log('🧪 Testing Lead-to-College Conversion...');

// Run the test
testLeadToCollegeConversion()
  .then(result => {
    console.log('🎯 Test Result:', result);
    
    // Check what's in localStorage
    console.log('\n📦 Checking localStorage...');
    const storageCheck = checkConvertedColleges();
    console.log('Storage Check:', storageCheck);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
  });
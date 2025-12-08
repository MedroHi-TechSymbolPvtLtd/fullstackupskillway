// Test Brevo API Connection
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Initialize the API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log('Testing Brevo API with key:', process.env.BREVO_API_KEY ? 'Key is set' : 'Key is missing');
console.log('Key starts with:', process.env.BREVO_API_KEY?.substring(0, 10));

// Test 1: Get Account Info
const accountApi = new SibApiV3Sdk.AccountApi();

console.log('\n=== Testing Brevo API Connection ===\n');

accountApi.getAccount()
  .then(data => {
    console.log('✅ SUCCESS! API Key is valid and working!\n');
    console.log('Account Details:');
    console.log('- Email:', data.email);
    console.log('- Company:', data.companyName);
    console.log('- Plan:', data.plan?.type);
    console.log('\n=== API Connection Test Passed ===\n');
  })
  .catch(error => {
    console.error('❌ FAILED! API Key is invalid or there is an issue:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      
      if (error.response.body) {
        try {
          const body = typeof error.response.body === 'string' 
            ? JSON.parse(error.response.body) 
            : error.response.body;
          console.error('Error Message:', body.message || body.error || 'Unknown error');
          console.error('Error Code:', body.code);
        } catch (e) {
          console.error('Raw Error:', error.response.body);
        }
      }
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n=== Troubleshooting Steps ===');
    console.log('1. Verify your API key starts with "xkeysib-"');
    console.log('2. Check that the API key is active in your Brevo account');
    console.log('3. Go to: https://app.brevo.com/settings/keys/api');
    console.log('4. Make sure there are no extra spaces in your .env file');
    
    process.exit(1);
  });

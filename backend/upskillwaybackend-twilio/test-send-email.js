// Test Sending Email via Brevo API
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Initialize the API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

console.log('=== Testing Brevo Email Sending ===\n');

// Create email object
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = "Test Email from UpSkillWay API";
sendSmtpEmail.htmlContent = "<html><body><h1>Hello!</h1><p>This is a test email sent via Brevo API from UpSkillWay.</p></body></html>";
sendSmtpEmail.sender = {
  name: "UpSkillWay",
  email: "dineshchilka143@gmail.com"  // Verified account email
};
sendSmtpEmail.to = [
  { email: "gsharma7078969894@gmail.com", name: "Test User" }
];
sendSmtpEmail.replyTo = {
  email: "dineshchilka143@gmail.com",
  name: "UpSkillWay Support"
};

console.log('Sending test email...');
console.log('From:', sendSmtpEmail.sender.email);
console.log('To:', sendSmtpEmail.to[0].email);
console.log('Subject:', sendSmtpEmail.subject);
console.log('');

apiInstance.sendTransacEmail(sendSmtpEmail)
  .then(data => {
    console.log('✅ SUCCESS! Email sent successfully!\n');
    console.log('Message ID:', data.messageId);
    console.log('\n=== Email Test Passed ===');
    console.log('Check your inbox at:', sendSmtpEmail.to[0].email);
  })
  .catch(error => {
    console.error('❌ FAILED! Could not send email:\n');

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

    console.log('\n=== Common Issues ===');
    console.log('1. Sender email must be verified in Brevo');
    console.log('2. Go to: https://app.brevo.com/senders');
    console.log('3. Add and verify your sender email address');
    console.log('4. Current sender:', sendSmtpEmail.sender.email);

    process.exit(1);
  });

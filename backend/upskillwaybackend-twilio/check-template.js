
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const templateSid = process.env.TWILIO_TEMPLATE_WELCOME;

console.log(`Checking Template: ${templateSid}`);

async function checkTemplate() {
    try {
        // Try to fetch content details
        // Note: This requires the Content API to be enabled
        const content = await client.content.v1.contents(templateSid).fetch();

        console.log('--- Template Details ---');
        console.log('SID:', content.sid);
        console.log('Friendly Name:', content.friendlyName);
        console.log('Language:', content.language);
        console.log('Variables:', JSON.stringify(content.variables));
        console.log('Types:', JSON.stringify(content.types));
        console.log('------------------------');
        console.log('Template exists and is accessible.');
    } catch (error) {
        console.error('Error fetching template:', error.message);
        console.log('\nPossible reasons:');
        console.log('1. The Template SID is incorrect.');
        console.log('2. The Content API is not enabled for this account.');
        console.log('3. Credentials do not have permission to view content.');
    }
}

checkTemplate();

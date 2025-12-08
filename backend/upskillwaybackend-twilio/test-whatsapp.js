
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

console.log('Testing Twilio Configuration...');
console.log('Account SID:', accountSid ? 'Set' : 'Missing');
console.log('Auth Token:', authToken ? 'Set' : 'Missing');
console.log('From Number:', fromNumber);

if (!accountSid || !authToken || !fromNumber) {
    console.error('Missing environment variables. Please check .env file.');
    process.exit(1);
}

const client = twilio(accountSid, authToken);

async function testConnection() {
    try {
        console.log('Verifying credentials...');
        const account = await client.api.accounts(accountSid).fetch();
        console.log('Credentials verified! Account Name:', account.friendlyName);
        console.log('Status:', account.status);

        // If a recipient number is provided as an argument, try to send a message
        const recipient = process.argv[2];
        if (recipient) {
            console.log(`Attempting to send template message to ${recipient}...`);
            const messageOptions = {
                from: fromNumber,
                to: recipient.startsWith('whatsapp:') ? recipient : `whatsapp:${recipient}`,
                contentSid: process.env.TWILIO_TEMPLATE_WELCOME
            };

            console.log('Message Options:', messageOptions);
            const message = await client.messages.create(messageOptions);
            console.log('Message sent! SID:', message.sid);
        } else {
            console.log('\nTo send a test message, run: node test-whatsapp.js <recipient_number>');
            console.log('Example: node test-whatsapp.js +919876543210');
        }

    } catch (error) {
        console.error('Twilio Error:', error.message);
        if (error.code) {
            console.error('Error Code:', error.code);
        }
    }
}

testConnection();

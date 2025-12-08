import twilio from 'twilio';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface TwilioMessageRequest {
    to: string;
    body?: string;
    mediaUrl?: string[];
    contentSid?: string;
    contentVariables?: Record<string, string>;
}

export class TwilioService {
    private client: twilio.Twilio;
    private fromNumber: string;

    constructor() {
        if (!config.twilio.accountSid || !config.twilio.authToken || !config.twilio.whatsappFrom) {
            throw new Error('Twilio configuration is incomplete. Please check environment variables.');
        }

        this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
        this.fromNumber = config.twilio.whatsappFrom;

        logger.info('Twilio service initialized');
    }

    /**
     * Send a WhatsApp message (free-form or template)
     */
    async sendMessage(request: TwilioMessageRequest) {
        try {
            const messageOptions: any = {
                from: this.fromNumber,
                to: `whatsapp:${request.to.replace('+', '')}`, // Ensure format is whatsapp:+1234567890
            };

            if (request.contentSid) {
                messageOptions.contentSid = request.contentSid;
                if (request.contentVariables) {
                    messageOptions.contentVariables = JSON.stringify(request.contentVariables);
                }
            } else {
                if (!request.body) {
                    throw new Error('Message body is required for non-template messages');
                }
                messageOptions.body = request.body;
            }

            if (request.mediaUrl && request.mediaUrl.length > 0) {
                messageOptions.mediaUrl = request.mediaUrl;
            }

            const message = await this.client.messages.create(messageOptions);

            logger.info('Twilio message sent:', { sid: message.sid, to: request.to, type: request.contentSid ? 'template' : 'text' });
            return message;
        } catch (error) {
            logger.error('Twilio send message failed:', error);
            throw error;
        }
    }
}

export const twilioService = new TwilioService();

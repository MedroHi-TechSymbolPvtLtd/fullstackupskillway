import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

// Removed invalid class declarations



/**
 * Brevo Email Client
 * Handles both API and SMTP email sending via Brevo
 */
export class BrevoClient {
  private apiInstance: any;
  private campaignApiInstance: any;
  private smtpTransporter!: nodemailer.Transporter;
  private readonly apiKey: string;

  constructor() {
    // Validate required configuration
    if (!config.brevo.apiKey) {
      throw new Error('Brevo API configuration is incomplete. Please set BREVO_API_KEY environment variable.');
    }

    this.apiKey = config.brevo.apiKey;

    // Initialize Brevo API client
    this.initializeApiClient();

    // Initialize SMTP transporter
    this.initializeSmtpTransporter();
  }

  /**
   * Initialize Brevo API client
   */
  private initializeApiClient(): void {
    try {
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = this.apiKey;

      this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      this.campaignApiInstance = new SibApiV3Sdk.EmailCampaignsApi();

      logger.info('Brevo API client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Brevo API client:', error);
      throw error;
    }
  }

  /**
   * Initialize SMTP transporter
   */
  private initializeSmtpTransporter(): void {
    try {
      if (!config.brevo.smtpUser || !config.brevo.smtpPass) {
        logger.warn('SMTP configuration incomplete. SMTP sending will not be available.');
        return;
      }

      this.smtpTransporter = nodemailer.createTransport({
        host: config.brevo.smtpHost,
        port: config.brevo.smtpPort,
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.brevo.smtpUser,
          pass: config.brevo.smtpPass,
        },
      });

      logger.info('SMTP transporter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SMTP transporter:', error);
      throw error;
    }
  }

  /**
   * Send transactional email via Brevo API
   * @param emailData - Email data
   * @returns Promise<BrevoApiResponse>
   */
  async sendTransactionalEmail(emailData: BrevoTransactionalEmail): Promise<BrevoApiResponse> {
    try {
      logger.info('Sending transactional email via Brevo API:', {
        to: emailData.to,
        subject: emailData.subject,
      });

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      // Set email properties
      sendSmtpEmail.to = [{ email: emailData.to, name: emailData.toName || '' }];
      sendSmtpEmail.subject = emailData.subject;
      sendSmtpEmail.htmlContent = emailData.html;
      sendSmtpEmail.textContent = emailData.text;

      if (emailData.from) {
        sendSmtpEmail.sender = {
          name: emailData.from.name || 'UpSkillWay',
          email: emailData.from.email,
        };
      }

      if (emailData.replyTo) {
        sendSmtpEmail.replyTo = {
          name: emailData.replyTo.name || '',
          email: emailData.replyTo.email,
        };
      }

      if (emailData.attachments && emailData.attachments.length > 0) {
        sendSmtpEmail.attachment = emailData.attachments.map(att => ({
          content: att.content,
          name: att.name,
        }));
      }

      // Add headers
      if (emailData.headers) {
        sendSmtpEmail.headers = emailData.headers;
      }

      // Add tags
      if (emailData.tags && emailData.tags.length > 0) {
        sendSmtpEmail.tags = emailData.tags;
      }

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      logger.info('Transactional email sent successfully via Brevo API:', {
        messageId: response.messageId,
        to: emailData.to,
      });

      return {
        success: true,
        messageId: response.messageId,
        status: 'sent',
        method: 'api',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      // Extract detailed error message from Brevo API response
      let errorMessage = 'Unknown error';
      let errorDetails: any = {};

      if (error?.response) {
        // Brevo SDK error with response
        errorDetails = {
          status: error.response.status,
          statusText: error.response.statusText,
          body: error.response.body,
          text: error.response.text,
        };

        // Try to extract error message from response body
        if (error.response.body) {
          if (typeof error.response.body === 'string') {
            try {
              const parsedBody = JSON.parse(error.response.body);
              errorMessage = parsedBody.message || parsedBody.error || error.response.statusText || 'Unknown error';
            } catch {
              errorMessage = error.response.body;
            }
          } else if (error.response.body.message) {
            errorMessage = error.response.body.message;
          } else if (error.response.body.error) {
            errorMessage = error.response.body.error;
          } else {
            errorMessage = error.response.statusText || 'Unknown error';
          }
        } else {
          errorMessage = error.response.statusText || error.message || 'Unknown error';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      logger.error('Failed to send transactional email via Brevo API:', {
        to: emailData.to,
        error: errorMessage,
        details: errorDetails,
        apiKeySet: !!this.apiKey,
        apiKeyLength: this.apiKey?.length || 0,
      });

      // Create a more informative error with helpful guidance
      let userFriendlyMessage = `Brevo API Error: ${errorMessage}`;

      // Provide specific guidance for common errors
      if (errorDetails.status === 401) {
        if (errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('invalid')) {
          userFriendlyMessage = `Brevo API authentication failed. Please verify:
1. BREVO_API_KEY is correctly set in your .env file
2. The API key is valid and active in your Brevo account
3. The sender email (${emailData.from?.email || 'default'}) is verified in your Brevo account
4. Your Brevo account has proper permissions`;
        }
      } else if (errorDetails.status === 400) {
        userFriendlyMessage = `Brevo API validation error: ${errorMessage}. Please check:
1. Sender email is verified in your Brevo account
2. Email format is correct
3. All required fields are provided`;
      }

      const detailedError = new Error(userFriendlyMessage);
      (detailedError as any).details = errorDetails;
      (detailedError as any).statusCode = errorDetails.status;
      throw detailedError;
    }
  }

  /**
   * Send email via SMTP
   * @param emailData - Email data
   * @returns Promise<BrevoApiResponse>
   */
  async sendSmtpEmail(emailData: BrevoTransactionalEmail): Promise<BrevoApiResponse> {
    try {
      if (!this.smtpTransporter) {
        throw new Error('SMTP transporter not initialized. Please check SMTP configuration.');
      }

      logger.info('Sending email via SMTP:', {
        to: emailData.to,
        subject: emailData.subject,
      });

      const mailOptions = {
        from: emailData.from ? `${emailData.from.name} <${emailData.from.email}>` : config.brevo.smtpUser,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        replyTo: emailData.replyTo?.email,
        attachments: emailData.attachments?.map(att => ({
          filename: att.name,
          content: att.content,
          encoding: 'base64',
        })),
        headers: emailData.headers,
      };

      const response = await this.smtpTransporter.sendMail(mailOptions);

      logger.info('Email sent successfully via SMTP:', {
        messageId: response.messageId,
        to: emailData.to,
      });

      return {
        success: true,
        messageId: response.messageId,
        status: 'sent',
        method: 'smtp',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to send email via SMTP:', {
        to: emailData.to,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Create email campaign
   * @param campaignData - Campaign data
   * @returns Promise<BrevoCampaignResponse>
   */
  async createEmailCampaign(campaignData: BrevoCampaignData): Promise<BrevoCampaignResponse> {
    try {
      logger.info('Creating email campaign via Brevo API:', {
        name: campaignData.name,
        subject: campaignData.subject,
        listIds: campaignData.listIds,
      });

      const emailCampaign = new SibApiV3Sdk.CreateEmailCampaign();

      // Set campaign properties
      emailCampaign.name = campaignData.name;
      emailCampaign.subject = campaignData.subject;
      emailCampaign.sender = {
        name: campaignData.sender.name,
        email: campaignData.sender.email,
      };
      emailCampaign.type = 'classic';
      emailCampaign.htmlContent = campaignData.htmlContent;
      emailCampaign.textContent = campaignData.textContent;

      if (campaignData.listIds && campaignData.listIds.length > 0) {
        emailCampaign.recipients = { listIds: campaignData.listIds };
      }

      if (campaignData.scheduledAt) {
        emailCampaign.scheduledAt = campaignData.scheduledAt;
      }

      if (campaignData.tags && campaignData.tags.length > 0) {
        emailCampaign.tags = campaignData.tags;
      }

      const response = await this.campaignApiInstance.createEmailCampaign(emailCampaign);

      logger.info('Email campaign created successfully:', {
        campaignId: response.id,
        name: campaignData.name,
      });

      return {
        success: true,
        campaignId: response.id,
        status: 'created',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to create email campaign:', {
        name: campaignData.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send email campaign
   * @param campaignId - Campaign ID
   * @returns Promise<BrevoApiResponse>
   */
  async sendEmailCampaign(campaignId: number): Promise<BrevoApiResponse> {
    try {
      logger.info('Sending email campaign:', { campaignId });

      const response = await this.campaignApiInstance.sendEmailCampaignNow(campaignId);

      logger.info('Email campaign sent successfully:', { campaignId });

      return {
        success: true,
        messageId: response.messageId,
        status: 'sent',
        method: 'campaign',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to send email campaign:', {
        campaignId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get campaign statistics
   * @param campaignId - Campaign ID
   * @returns Promise<BrevoCampaignStats>
   */
  async getCampaignStats(campaignId: number): Promise<BrevoCampaignStats> {
    try {
      logger.info('Getting campaign statistics:', { campaignId });

      const response = await this.campaignApiInstance.getEmailCampaign(campaignId);

      return {
        success: true,
        campaignId,
        stats: {
          sent: response.statistics?.sent || 0,
          delivered: response.statistics?.delivered || 0,
          opened: response.statistics?.opened || 0,
          clicked: response.statistics?.clicked || 0,
          bounced: response.statistics?.bounced || 0,
          unsubscribed: response.statistics?.unsubscribed || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to get campaign statistics:', {
        campaignId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Validate email address format
   * @param email - Email address to validate
   * @returns boolean
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Test SMTP connection
   * @returns Promise<boolean>
   */
  async testSmtpConnection(): Promise<boolean> {
    try {
      if (!this.smtpTransporter) {
        return false;
      }

      await this.smtpTransporter.verify();
      logger.info('SMTP connection test successful');
      return true;
    } catch (error) {
      logger.error('SMTP connection test failed:', error);
      return false;
    }
  }
}

// Export types
export interface BrevoTransactionalEmail {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  from?: {
    name: string;
    email: string;
  };
  replyTo?: {
    name: string;
    email: string;
  };
  attachments?: Array<{
    name: string;
    content: string; // Base64 encoded
  }>;
  headers?: Record<string, string>;
  tags?: string[];
}

export interface BrevoCampaignData {
  name: string;
  subject: string;
  sender: {
    name: string;
    email: string;
  };
  htmlContent: string;
  textContent?: string;
  listIds?: number[];
  scheduledAt?: string;
  tags?: string[];
  campaignId?: number;
}

export interface BrevoApiResponse {
  success: boolean;
  messageId?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  method: 'api' | 'smtp' | 'campaign';
  timestamp: string;
}

export interface BrevoCampaignResponse {
  success: boolean;
  campaignId: number;
  status: 'created' | 'scheduled' | 'sent';
  timestamp: string;
}

export interface BrevoCampaignStats {
  success: boolean;
  campaignId: number;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  timestamp: string;
}

// Create and export singleton instance
export const brevoClient = new BrevoClient();
export default brevoClient;

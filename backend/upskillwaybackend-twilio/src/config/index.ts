// src/config/index.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper function to get allowed origins
const getAllowedOrigins = (): string[] => {
  if (process.env.NODE_ENV === 'production') {
    return [process.env.FRONTEND_URL || 'https://yourproductiondomain.com'];
  }

  // Development origins
  const devOrigins = [
    'https://65.1.251.7:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ];

  // Add custom frontend URL if provided
  if (process.env.FRONTEND_URL) {
    devOrigins.push(process.env.FRONTEND_URL);
  }


  return devOrigins;
};

// Application configuration
export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres@postgres:5432/UpSkillWay?schema=public',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS configuration
  cors: {
    allowedOrigins: getAllowedOrigins(),
    credentials: true,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },



  // Brevo Email API configuration
  brevo: {
    apiKey: process.env.BREVO_API_KEY,
    smtpHost: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    smtpPort: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
    smtpUser: process.env.BREVO_SMTP_USER,
    smtpPass: process.env.BREVO_SMTP_PASS,
    baseUrl: process.env.BREVO_BASE_URL || 'https://api.brevo.com/v3',
  },

  // Redis configuration for email queues
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // Twilio Configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM,
    templateWelcome: process.env.TWILIO_TEMPLATE_WELCOME,
  },

  // Rate limiting configuration - Production-ready with Redis support
  rateLimit: {
    // Redis configuration for distributed rate limiting
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      keyPrefix: 'upskillway:ratelimit:',
      maxRetriesPerRequest: null, // Required by BullMQ
      lazyConnect: true,
    },

    // General rate limiting (per IP)
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5000, // 5000 requests per 15 minutes per IP (increased for development)
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },

    // API endpoints rate limiting (more restrictive)
    api: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 2000, // 2000 requests per minute per IP (increased for development)
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },

    // Authentication endpoints (strict protection)
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // 10 login attempts per 15 minutes per IP
      skipSuccessfulRequests: true, // Don't count successful logins
      skipFailedRequests: false,
    },

    // Lead submission (public endpoint protection)
    lead: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // 50 lead submissions per 15 minutes per IP (increased for development)
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },

    // File upload protection
    upload: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 10, // 10 uploads per 5 minutes per IP
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },

    // CMS operations (admin endpoints)
    cms: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 100, // 100 CMS operations per minute per IP
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },

    // Burst protection (short-term spike protection)
    burst: {
      windowMs: 60 * 1000, // 1 minute
      max: 500, // 500 requests per minute for burst protection (increased for development)
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },

    // Dynamic rate limiting based on server load
    dynamic: {
      enabled: false, // Disabled for development to prevent aggressive limiting
      baseMax: 1000,
      highLoadThreshold: 0.8, // 80% memory usage
      mediumLoadThreshold: 0.6, // 60% memory usage
      highLoadMultiplier: 0.5, // Reduce to 50% of base limit (less aggressive)
      mediumLoadMultiplier: 0.8, // Reduce to 80% of base limit (less aggressive)
    },
  },
};

// Validation function to check if all required environment variables are set
export const validateConfig = (): void => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }



  // Validate Brevo API configuration
  const brevoRequired = ['BREVO_API_KEY', 'BREVO_SMTP_USER', 'BREVO_SMTP_PASS'];
  const brevoMissing = brevoRequired.filter(key => !process.env[key]);

  if (brevoMissing.length > 0) {
    console.warn(`⚠️  Brevo API configuration incomplete. Missing: ${brevoMissing.join(', ')}`);
    console.warn('Email functionality will not work without proper Brevo API configuration.');
  }

  // Validate Twilio Configuration
  const twilioRequired = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_FROM'];
  const twilioMissing = twilioRequired.filter(key => !process.env[key]);

  if (twilioMissing.length > 0) {
    console.warn(`⚠️  Twilio configuration incomplete. Missing: ${twilioMissing.join(', ')}`);
    console.warn('WhatsApp functionality will not work without proper Twilio configuration.');
  }
};
// src/middlewares/security.ts
import helmet from 'helmet';
import cors from 'cors';
import { config } from '../config';

/**
 * Security middleware configuration
 */

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Log the origin for debugging
    console.log('🔍 CORS Check - Origin:', origin);
    console.log('🔍 CORS Check - Allowed Origins:', config.cors.allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, curl requests, or Postman)
    if (!origin) {
      console.log('✅ CORS - Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is allowed
    const allowedOrigins = config.cors.allowedOrigins;
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS - Origin allowed:', origin);
      return callback(null, true);
    }
    
    console.log('❌ CORS - Origin NOT allowed:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: config.cors.credentials,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Helmet security headers configuration
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
};

// CORS middleware
export const corsMiddleware = cors(corsOptions);

// Helmet middleware
export const helmetMiddleware = helmet(helmetOptions);
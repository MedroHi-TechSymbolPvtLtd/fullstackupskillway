import rateLimit from 'express-rate-limit';
import { config } from '../config';

/**
 * Simplified Rate Limiting Middleware
 * Handles high traffic scenarios with proper load balancing
 */

// Enhanced error response for rate limiting
const createRateLimitResponse = (type: string, retryAfter?: number) => {
  const baseResponse = {
    success: false,
    message: `Rate limit exceeded for ${type}. Please try again later.`,
    error: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
    retryAfter: retryAfter || 60, // seconds
  };

  return baseResponse;
};

// Dynamic rate limiting based on server load
const getDynamicMax = (baseMax: number): number => {
  if (!config.rateLimit.dynamic.enabled) {
    return baseMax;
  }

  const memoryUsage = process.memoryUsage();
  const memoryPercentage = memoryUsage.heapUsed / memoryUsage.heapTotal;

  if (memoryPercentage > config.rateLimit.dynamic.highLoadThreshold) {
    const newMax = Math.floor(baseMax * config.rateLimit.dynamic.highLoadMultiplier);
    return newMax;
  } else if (memoryPercentage > config.rateLimit.dynamic.mediumLoadThreshold) {
    const newMax = Math.floor(baseMax * config.rateLimit.dynamic.mediumLoadMultiplier);
    return newMax;
  }

  return baseMax;
};

// Skip function for health checks and static content
const shouldSkipRateLimit = (req: any): boolean => {
  const skipPaths = [
    '/health',
    '/health/detailed',
    '/ready',
    '/live',
    '/api-docs',
    '/api-docs.json',
  ];
  
  return skipPaths.some(path => req.path === path || req.path.startsWith(path));
};

/**
 * General Rate Limiter - First layer of protection
 * Handles overall traffic per IP
 */
export const generalRateLimit = rateLimit({
  windowMs: config.rateLimit.general.windowMs,
  max: (req, res) => {
    if (shouldSkipRateLimit(req)) return 0;
    return getDynamicMax(config.rateLimit.general.max);
  },
  message: createRateLimitResponse('general requests'),
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipRateLimit,
  // Enhanced error handling
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.general.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('general requests', retryAfter));
  },
});

/**
 * API Rate Limiter - Second layer for API endpoints
 * More restrictive for API calls
 */
export const apiRateLimit = rateLimit({
  windowMs: config.rateLimit.api.windowMs,
  max: (req, res) => {
    if (shouldSkipRateLimit(req)) return 0;
    return getDynamicMax(config.rateLimit.api.max);
  },
  message: createRateLimitResponse('API requests'),
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipRateLimit,
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.api.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('API requests', retryAfter));
  },
});

/**
 * Authentication Rate Limiter - Strict protection for login endpoints
 * Prevents brute force attacks
 */
export const authRateLimit = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  message: createRateLimitResponse('authentication attempts'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: config.rateLimit.auth.skipSuccessfulRequests,
  skipFailedRequests: config.rateLimit.auth.skipFailedRequests,
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.auth.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('authentication attempts', retryAfter));
  },
});

/**
 * Lead Submission Rate Limiter - Public endpoint protection
 * Prevents spam on lead forms
 */
export const leadRateLimit = rateLimit({
  windowMs: config.rateLimit.lead.windowMs,
  max: config.rateLimit.lead.max,
  message: createRateLimitResponse('lead submissions'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: config.rateLimit.lead.skipSuccessfulRequests,
  skipFailedRequests: config.rateLimit.lead.skipFailedRequests,
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.lead.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('lead submissions', retryAfter));
  },
});

/**
 * File Upload Rate Limiter - Upload protection
 * Prevents abuse of file upload endpoints
 */
export const uploadRateLimit = rateLimit({
  windowMs: config.rateLimit.upload.windowMs,
  max: config.rateLimit.upload.max,
  message: createRateLimitResponse('file uploads'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: config.rateLimit.upload.skipSuccessfulRequests,
  skipFailedRequests: config.rateLimit.upload.skipFailedRequests,
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.upload.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('file uploads', retryAfter));
  },
});

/**
 * CMS Operations Rate Limiter - Admin endpoint protection
 * Protects CMS operations from abuse
 */
export const cmsRateLimit = rateLimit({
  windowMs: config.rateLimit.cms.windowMs,
  max: (req, res) => {
    if (shouldSkipRateLimit(req)) return 0;
    return getDynamicMax(config.rateLimit.cms.max);
  },
  message: createRateLimitResponse('CMS operations'),
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipRateLimit,
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.cms.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('CMS operations', retryAfter));
  },
});

/**
 * Burst Protection Rate Limiter - Short-term spike protection
 * Handles sudden traffic spikes
 */
export const burstRateLimit = rateLimit({
  windowMs: config.rateLimit.burst.windowMs,
  max: config.rateLimit.burst.max,
  message: createRateLimitResponse('burst requests'),
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipRateLimit,
  handler: (req, res) => {
    const retryAfter = Math.ceil(config.rateLimit.burst.windowMs / 1000);
    res.status(429).json(createRateLimitResponse('burst requests', retryAfter));
  },
});

/**
 * Custom Rate Limiter Factory
 * Creates rate limiters for specific use cases
 */
export const createCustomRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || createRateLimitResponse('custom requests'),
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
    keyGenerator: options.keyGenerator,
    handler: (req, res) => {
      const retryAfter = Math.ceil(options.windowMs / 1000);
      res.status(429).json(createRateLimitResponse('custom requests', retryAfter));
    },
  });
};

// Export all rate limiters
export {
  generalRateLimit as frontendRateLimit, // Alias for backward compatibility
};

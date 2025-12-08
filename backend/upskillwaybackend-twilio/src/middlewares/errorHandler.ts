import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * Enhanced Error Handling Middleware
 * Handles all errors with proper 429 responses and retry logic
 */

// Rate limit error class
export class RateLimitError extends AppError {
  public readonly retryAfter: number;
  public readonly limitType: string;

  constructor(message: string, retryAfter: number = 60, limitType: string = 'general') {
    super(message, 429);
    this.retryAfter = retryAfter;
    this.limitType = limitType;
    this.name = 'RateLimitError';
  }
}

// Server overload error class
export class ServerOverloadError extends AppError {
  public readonly retryAfter: number;
  public readonly serverLoad: number;

  constructor(message: string, retryAfter: number = 30, serverLoad: number = 0) {
    super(message, 503);
    this.retryAfter = retryAfter;
    this.serverLoad = serverLoad;
    this.name = 'ServerOverloadError';
  }
}

// Circuit breaker error class
export class CircuitBreakerError extends AppError {
  public readonly retryAfter: number;
  public readonly circuitState: string;

  constructor(message: string, retryAfter: number = 30, circuitState: string = 'OPEN') {
    super(message, 503);
    this.retryAfter = retryAfter;
    this.circuitState = circuitState;
    this.name = 'CircuitBreakerError';
  }
}

/**
 * Enhanced error handler with proper 429 responses
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error with enhanced context
  logger.error({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown',
  });

  // Handle rate limit errors
  if (error instanceof RateLimitError) {
    res.status(429).json({
      success: false,
      message: error.message,
      error: 'RATE_LIMIT_EXCEEDED',
      limitType: error.limitType,
      retryAfter: error.retryAfter,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle server overload errors
  if (error instanceof ServerOverloadError) {
    res.status(503).json({
      success: false,
      message: error.message,
      error: 'SERVER_OVERLOAD',
      serverLoad: error.serverLoad,
      retryAfter: error.retryAfter,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle circuit breaker errors
  if (error instanceof CircuitBreakerError) {
    res.status(503).json({
      success: false,
      message: error.message,
      error: 'CIRCUIT_BREAKER_OPEN',
      circuitState: error.circuitState,
      retryAfter: error.retryAfter,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle known application errors
  if (error instanceof AppError) {
    // Add retry information for certain error types
    const retryInfo = getRetryInfo(error.statusCode);
    const response: any = {
      success: false,
      message: error.message,
      error: error.constructor.name,
      timestamp: new Date().toISOString(),
    };

    if (retryInfo.shouldRetry) {
      response.retryAfter = retryInfo.retryAfter;
      response.retryable = true;
    }

    res.status(error.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  const appError = handleError(error);
  const retryInfo = getRetryInfo(appError.statusCode);
  
  const response: any = {
    success: false,
    message: appError.message,
    error: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
  };

  if (retryInfo.shouldRetry) {
    response.retryAfter = retryInfo.retryAfter;
    response.retryable = true;
  }

  res.status(appError.statusCode).json(response);
};

/**
 * Get retry information based on error status code
 */
const getRetryInfo = (statusCode: number): { shouldRetry: boolean; retryAfter: number } => {
  switch (statusCode) {
    case 429: // Rate Limited
      return { shouldRetry: true, retryAfter: 60 };
    case 503: // Service Unavailable
      return { shouldRetry: true, retryAfter: 30 };
    case 502: // Bad Gateway
      return { shouldRetry: true, retryAfter: 10 };
    case 504: // Gateway Timeout
      return { shouldRetry: true, retryAfter: 15 };
    case 408: // Request Timeout
      return { shouldRetry: true, retryAfter: 5 };
    case 500: // Internal Server Error
      return { shouldRetry: true, retryAfter: 30 };
    default:
      return { shouldRetry: false, retryAfter: 0 };
  }
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    error: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
    retryable: false,
  });
};

/**
 * Async error wrapper with enhanced error handling
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Add request context to error
      if (error instanceof Error) {
        (error as any).requestContext = {
          url: req.url,
          method: req.method,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString(),
        };
      }
      next(error);
    });
  };
};

/**
 * Timeout error handler
 */
export const timeoutHandler = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: 'Request timeout',
          error: 'REQUEST_TIMEOUT',
          timeout: timeoutMs,
          timestamp: new Date().toISOString(),
          retryAfter: 5,
          retryable: true,
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));
    
    next();
  };
};

/**
 * Request validation error handler
 */
export const validationErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'ValidationError' || error.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: error.errors || error.issues,
      timestamp: new Date().toISOString(),
      retryable: false,
    });
    return;
  }
  next(error);
};

/**
 * Database connection error handler
 */
export const databaseErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: 'DATABASE_UNAVAILABLE',
      timestamp: new Date().toISOString(),
      retryAfter: 30,
      retryable: true,
    });
    return;
  }
  next(error);
};

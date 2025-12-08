import { ZodError } from 'zod';

/**
 * Custom error classes for the application
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}

// Error handler utility
export const handleError = (error: Error): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    console.error('Prisma error details:', { code: prismaError.code, message: prismaError.message, meta: prismaError.meta });
    
    switch (prismaError.code) {
      case 'P2002':
        return new ConflictError('A record with this information already exists');
      case 'P2025':
        return new NotFoundError('Record not found');
      default:
        return new InternalServerError(`Database operation failed: ${prismaError.code} - ${prismaError.message}`);
    }
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token has expired');
  }

  // Handle validation errors
  if (error instanceof ZodError) {
    const firstIssue = error.issues?.[0];
    const fieldPath = firstIssue?.path?.length ? firstIssue.path.join('.') : undefined;
    const message = firstIssue?.message || 'Invalid input data';
    const formattedMessage = fieldPath ? `${fieldPath}: ${message}` : message;
    return new ValidationError(formattedMessage);
  }

  // Default to internal server error
  return new InternalServerError(error.message);
};

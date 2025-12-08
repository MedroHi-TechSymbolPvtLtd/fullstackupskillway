import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../config/jwt';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { sendError } from '../utils/response';

// Extend Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token and extracts user information
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Access token is required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    // Verify the token
    const payload = verifyToken(token);
    
    // Ensure it's an access token
    if (payload.type !== 'access') {
      throw new AuthenticationError('Invalid token type');
    }

    // Attach user data to request
    req.user = payload;
    
    next();
  } catch (error) {
    sendError(res, 'Authentication failed', 401, error instanceof Error ? error.message : 'Unknown error');
  }
};

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 */
export const requireRole = (allowedRoles: ('admin' | 'sales')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      sendError(res, 'Authorization failed', 403, error instanceof Error ? error.message : 'Unknown error');
    }
  };
};

/**
 * Admin-only middleware
 * Shortcut for requiring admin role
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Sales-only middleware
 * Shortcut for requiring sales role
 */
export const requireSales = requireRole(['sales']);

/**
 * Admin or Sales middleware
 * Allows both admin and sales users
 */
export const requireAuth = requireRole(['admin', 'sales']);

/**
 * WhatsApp permission middleware
 * Checks if user has permission to send WhatsApp messages
 */
export const requireWhatsAppPermission = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated');
    }

    // Admin users have full WhatsApp access
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Sales users have limited WhatsApp access
    if (req.user.role === 'sales') {
      // For now, allow sales users to send messages
      // In the future, you can add more granular permission checks here
      next();
      return;
    }

    throw new AuthorizationError('Access denied. WhatsApp messaging requires admin or sales role');
  } catch (error) {
    sendError(res, 'WhatsApp permission denied', 403, error instanceof Error ? error.message : 'Unknown error');
  }
};
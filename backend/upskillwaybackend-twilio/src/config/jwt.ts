import jwt from 'jsonwebtoken';

// JWT configuration
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

// JWT payload interface
export interface JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'sales';
  type: 'access' | 'refresh';
}

// Generate access token
export const generateAccessToken = (payload: Omit<JWTPayload, 'type'>): string => {
  const tokenPayload = { ...payload, type: 'access' };
  
  return (jwt.sign as any)(tokenPayload, JWT_CONFIG.secret, { 
    expiresIn: JWT_CONFIG.accessExpiresIn 
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<JWTPayload, 'type'>): string => {
  const tokenPayload = { ...payload, type: 'refresh' };
  
  return (jwt.sign as any)(tokenPayload, JWT_CONFIG.secret, { 
    expiresIn: JWT_CONFIG.refreshExpiresIn 
  });
};

// Verify token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};

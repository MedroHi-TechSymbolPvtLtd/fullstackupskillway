import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../config/jwt';
import { validateAdminCredentials, getAdminProfile } from '../config/admin';
import { AuthenticationError, NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Authentication service
 * Handles login, token generation, and refresh logic
 */

// Admin login service
export const adminLogin = async (email: string, password: string) => {
  try {
    // Validate admin credentials
    if (!validateAdminCredentials(email, password)) {
      throw new AuthenticationError('Invalid admin credentials');
    }

    // Generate tokens
    const adminProfile = getAdminProfile();
    const accessToken = generateAccessToken({
      id: adminProfile.id,
      email: adminProfile.email,
      role: adminProfile.role,
    });

    const refreshToken = generateRefreshToken({
      id: adminProfile.id,
      email: adminProfile.email,
      role: adminProfile.role,
    });

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        role: 'admin',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    logger.info(`Admin login successful: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: adminProfile,
    };
  } catch (error) {
    logger.error(`Admin login failed: ${email}`, error);
    throw error;
  }
};

// Sales user login service
export const salesLogin = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        role: 'sales',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    logger.info(`Sales user login successful: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    logger.error(`Sales user login failed: ${email}`, error);
    throw error;
  }
};

// Refresh token service
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Find refresh token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AuthenticationError('Invalid refresh token');
    }

    if (tokenRecord.revoked) {
      throw new AuthenticationError('Refresh token has been revoked');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new AuthenticationError('Refresh token has expired');
    }

    // Verify the token
    const payload = verifyToken(refreshToken);
    if (payload.type !== 'refresh') {
      throw new AuthenticationError('Invalid token type');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    // Generate new refresh token (token rotation)
    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: tokenRecord.userId,
        role: tokenRecord.role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    logger.info(`Token refresh successful for user: ${payload.email}`);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    logger.error('Token refresh failed', error);
    throw error;
  }
};

// Logout service
export const logout = async (refreshToken: string) => {
  try {
    // Find and revoke refresh token
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (tokenRecord) {
      await prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revoked: true },
      });
    }

    logger.info('User logged out successfully');
  } catch (error) {
    logger.error('Logout failed', error);
    throw error;
  }
};

// Get user profile service
export const getUserProfile = async (userId: string, role: 'admin' | 'sales') => {
  try {
    if (role === 'admin') {
      return getAdminProfile();
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    logger.error(`Get user profile failed for user: ${userId}`, error);
    throw error;
  }
};

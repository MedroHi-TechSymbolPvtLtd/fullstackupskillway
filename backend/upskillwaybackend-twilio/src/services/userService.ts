import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';
import { CreateUserInput, UpdateUserInput } from '../validators/user';

/**
 * User service
 * Handles user management operations (admin only)
 */

// Create user service
export const createUser = async (userData: CreateUserInput) => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Exclude raw password from create payload
    const { password, ...rest } = userData;

    // Create user
    const user = await prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
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

    logger.info(`User created: ${user.email}`);

    return user;
  } catch (error) {
    logger.error('Create user failed', error);
    throw error;
  }
};

// Get all users service
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error('Get all users failed', error);
    throw error;
  }
};

// Get user by ID service
export const getUserById = async (userId: string) => {
  try {
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
    logger.error(`Get user by ID failed: ${userId}`, error);
    throw error;
  }
};

// Update user service
export const updateUser = async (userId: string, userData: UpdateUserInput) => {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check if email is being changed and if it already exists
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (emailExists) {
        throw new ConflictError('User with this email already exists');
      }
    }

    // Prepare update data
    const updateData: any = { ...userData };

    // Hash password if provided
    if (userData.password) {
      updateData.passwordHash = await bcrypt.hash(userData.password, 12);
      delete updateData.password;
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    logger.info(`User updated: ${user.email}`);

    return user;
  } catch (error) {
    logger.error(`Update user failed: ${userId}`, error);
    throw error;
  }
};

// Activate user service
export const activateUser = async (userId: string) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
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

    logger.info(`User activated: ${user.email}`);

    return user;
  } catch (error) {
    logger.error(`Activate user failed: ${userId}`, error);
    throw error;
  }
};

// Deactivate user service
export const deactivateUser = async (userId: string) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
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

    logger.info(`User deactivated: ${user.email}`);

    return user;
  } catch (error) {
    logger.error(`Deactivate user failed: ${userId}`, error);
    throw error;
  }
};

// Delete user service
export const deleteUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info(`User deleted: ${user.email}`);

    return { message: 'User deleted successfully' };
  } catch (error) {
    logger.error(`Delete user failed: ${userId}`, error);
    throw error;
  }
};

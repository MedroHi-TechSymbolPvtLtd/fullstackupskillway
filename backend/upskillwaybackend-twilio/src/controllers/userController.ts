import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
} from '../services/userService';
import { CreateUserInput, UpdateUserInput } from '../validators/user';
import { paginationSchema } from '../utils/validation';

/**
 * User controller
 * Handles user management operations (admin only)
 */

// Create user controller
export const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const userData: CreateUserInput = req.body;

  const user = await createUser(userData);

  sendSuccess(res, user, 'User created successfully', 201);
});

// Get all users controller
export const getAllUsersController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);

  const result = await getAllUsers(page, limit);

  sendPaginated(res, result.users, result.pagination, 'Users retrieved successfully');
});

// Get user by ID controller
export const getUserByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserById(id);

  sendSuccess(res, user, 'User retrieved successfully');
});

// Update user controller
export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData: UpdateUserInput = req.body;

  const user = await updateUser(id, userData);

  sendSuccess(res, user, 'User updated successfully');
});

// Activate user controller
export const activateUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await activateUser(id);

  sendSuccess(res, user, 'User activated successfully');
});

// Deactivate user controller
export const deactivateUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await deactivateUser(id);

  sendSuccess(res, user, 'User deactivated successfully');
});

// Delete user controller
export const deleteUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteUser(id);

  sendSuccess(res, result, 'User deleted successfully');
});

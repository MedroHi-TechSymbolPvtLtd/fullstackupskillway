import { Response } from 'express';

/**
 * Standardized API response utilities
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Success response
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

// Error response
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string | string[] | any
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: Array.isArray(error) ? error.join(', ') : (typeof error === 'string' ? error : JSON.stringify(error)),
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

// Pagination response
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message: string = 'Success'
): void => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
};

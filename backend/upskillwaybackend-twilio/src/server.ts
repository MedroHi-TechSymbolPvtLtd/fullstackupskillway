import { config, validateConfig } from './config';
import { logger } from './utils/logger';
import app from './app';

/**
 * UpSkillWay CMS + Auth Microservice Server
 * 
 * This is the main entry point for the application.
 * It starts the Express server and handles graceful shutdown.
 */

// Validate configuration
try {
  validateConfig();
  logger.info('Configuration validated successfully');
} catch (error) {
  logger.error('Configuration validation failed:', error);
  process.exit(1);
}

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 UpSkillWay CMS + Auth API server is running on port ${config.port}`);
  logger.info(`📚 API Documentation available at: http://localhost:${config.port}/api-docs`);
  logger.info(`🏥 Health check available at: http://localhost:${config.port}/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force close server after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default server;

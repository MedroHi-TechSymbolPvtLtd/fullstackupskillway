import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { config } from './config';
import { corsMiddleware, helmetMiddleware } from './middlewares/security';
import { 
  generalRateLimit, 
  apiRateLimit, 
  authRateLimit, 
  leadRateLimit, 
  uploadRateLimit, 
  cmsRateLimit, 
  burstRateLimit 
} from './middlewares/simpleRateLimiter';
import { 
  errorHandler, 
  notFoundHandler, 
  timeoutHandler, 
  validationErrorHandler, 
  databaseErrorHandler 
} from './middlewares/errorHandler';
import { 
  loadBalancerMiddleware, 
  healthCheckMiddleware, 
  metricsMiddleware, 
  gracefulDegradationMiddleware, 
  intelligentThrottlingMiddleware,
  loadBalancerDebugEndpoint,
  resetCircuitBreaker
} from './middlewares/loadBalancer';
import { 
  performanceMonitoringMiddleware, 
  performanceMetricsEndpoint, 
  performanceSummaryEndpoint, 
  performanceHealthCheckEndpoint, 
  performanceHistoryEndpoint 
} from './middlewares/performanceMonitor';
import { httpLogger } from './utils/logger';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import cmsRoutes from './routes/cms';
import leadRoutes from './routes/lead';
import collegeRoutes from './routes/college';
import trainerRoutes from './routes/trainer';
import crmRoutes from './routes/crm';
import dashboardRoutes from './routes/dashboard';
import trainingRoutes from './routes/training';
import trainerBookingRoutes from './routes/trainerBooking';
import collegeTrainerRoutes from './routes/collegeTrainer';
import excelUploadRoutes from './routes/excelUpload';
import whatsappRoutes from './routes/whatsapp';
import emailRoutes from './routes/email';
import emailTemplateRoutes from './routes/emailTemplate';
import emailAutomationRoutes from './routes/emailAutomation';
import leadEmailRoutes from './routes/leadEmail';
import notificationRoutes from './routes/notification';
import studyAbroadRoutes from './routes/studyAbroad';
import codingKidsRoutes from './routes/codingKids';
import assetRoutes from './routes/assets';
import landingRoutes from './routes/landing';
import referRoutes from './routes/refer';

// Create Express application
const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Performance monitoring (first middleware to track all requests)
app.use(performanceMonitoringMiddleware);

// Load balancer and circuit breaker
app.use(loadBalancerMiddleware);

// Intelligent throttling based on server load
app.use(intelligentThrottlingMiddleware);

// Graceful degradation under high load
app.use(gracefulDegradationMiddleware);

// Rate limiting layers (progressive protection)
app.use(burstRateLimit); // First layer: burst protection
app.use(generalRateLimit); // Second layer: general rate limiting

// Timeout handling
app.use(timeoutHandler(30000)); // 30 second timeout

// Logging middleware
app.use(httpLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UpSkillWay CMS + Auth API',
      version: '1.0.0',
      description: 'A comprehensive CMS and Authentication microservice for UpSkillWay',
      contact: {
        name: 'UpSkillWay Team',
        email: 'admin@upskillway.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            error: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints for admin and sales users' },
      { name: 'Users', description: 'User management endpoints (admin only)' },
      { name: 'CMS - Blogs', description: 'Blog content management endpoints (admin only)' },
      { name: 'CMS - Videos', description: 'Video content management endpoints (admin only)' },
      { name: 'CMS - FAQs', description: 'FAQ content management endpoints (admin only)' },
      { name: 'CMS - Testimonials', description: 'Testimonial content management endpoints (admin only)' },
      { name: 'CMS - Courses', description: 'Course content management endpoints (admin only)' },
      { name: 'CMS - Ebooks', description: 'Ebook content management endpoints (admin only)' },
      { name: 'CMS - Study Abroad', description: 'Study abroad content management endpoints (admin only)' },
      { name: 'Leads', description: 'Lead capture and management endpoints' },
      { name: 'WhatsApp', description: 'WhatsApp messaging endpoints (admin/sales only)' },
    { name: 'Email', description: 'Email automation endpoints (admin/sales only)' },
    { name: 'Email Webhook', description: 'Email webhook endpoints (public)' },
    ],
  },
  // Use absolute paths from project root so swagger-jsdoc resolves in ts-node/dev
  apis: [
    path.resolve(process.cwd(), 'src/routes/*.ts'),
    path.resolve(process.cwd(), 'src/controllers/*.ts'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Raw JSON spec for import
app.get('/api-docs.json', (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// Swagger documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'UpSkillWay API Documentation',
}));

// Health check endpoints for load balancing
app.get('/health', healthCheckMiddleware);
app.get('/health/detailed', healthCheckMiddleware);
app.get('/ready', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is ready to accept traffic',
    timestamp: new Date().toISOString()
  });
});
app.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// Performance monitoring endpoints
app.get('/metrics', performanceMetricsEndpoint);
app.get('/metrics/summary', performanceSummaryEndpoint);
app.get('/metrics/health', performanceHealthCheckEndpoint);
app.get('/metrics/history', performanceHistoryEndpoint);

// Load balancer debug endpoint
app.get('/debug/loadbalancer', loadBalancerDebugEndpoint);

// Reset circuit breaker endpoint (for development/testing)
app.post('/debug/reset-circuit-breaker', (req, res) => {
  resetCircuitBreaker();
  res.status(200).json({
    success: true,
    message: 'Circuit breaker reset successfully',
    timestamp: new Date().toISOString(),
  });
});

// API routes with specific rate limiting
app.use('/api/v1/admin', apiRateLimit, adminRoutes);
app.use('/api/v1/auth', authRateLimit, authRoutes);
app.use('/api/v1/users', apiRateLimit, userRoutes);
app.use('/api/v1/dashboard', apiRateLimit, dashboardRoutes);
app.use('/api/v1/crm', apiRateLimit, crmRoutes);
app.use('/api/v1/colleges', apiRateLimit, collegeRoutes);
app.use('/api/v1/trainers', apiRateLimit, trainerRoutes);
app.use('/api/v1/trainings', apiRateLimit, trainingRoutes);
app.use('/api/v1/trainer-bookings', apiRateLimit, trainerBookingRoutes);
app.use('/api/v1/college-trainers', apiRateLimit, collegeTrainerRoutes);
app.use('/api/v1/excel-upload', uploadRateLimit, excelUploadRoutes);
app.use('/api/v1/whatsapp', apiRateLimit, whatsappRoutes);
app.use('/api/v1/email', apiRateLimit, emailRoutes);
app.use('/api/v1/email-templates', apiRateLimit, emailTemplateRoutes);
app.use('/api/v1/email-automations', apiRateLimit, emailAutomationRoutes);
app.use('/api/v1/lead-emails', apiRateLimit, leadEmailRoutes);
app.use('/api/v1/notifications', apiRateLimit, notificationRoutes);
app.use('/api/v1/study-abroad', apiRateLimit, studyAbroadRoutes);
app.use('/api/v1/coding-kids', apiRateLimit, codingKidsRoutes);
app.use('/api/v1/assets', apiRateLimit, assetRoutes);
app.use('/api/v1/landing', apiRateLimit, landingRoutes);
app.use('/api/v1/refer', apiRateLimit, referRoutes);
// Mount leads BEFORE the generic '/api/v1' CMS router so it is not intercepted
app.use('/api/v1/leads', leadRateLimit, leadRoutes);
// Mount CMS routes at /api/v1/cms
app.use('/api/v1/cms', cmsRateLimit, cmsRoutes);

// Error handling middleware (order matters!)
app.use(validationErrorHandler);
app.use(databaseErrorHandler);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

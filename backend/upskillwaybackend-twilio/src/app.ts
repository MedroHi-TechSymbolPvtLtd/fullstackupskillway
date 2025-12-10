// CLEAN PRODUCTION app.ts — All unstable load-balancer logic removed

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
  cmsRateLimit 
} from './middlewares/simpleRateLimiter';

import { 
  errorHandler, 
  notFoundHandler, 
  timeoutHandler, 
  validationErrorHandler, 
  databaseErrorHandler 
} from './middlewares/errorHandler';

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

const app = express();

// Trust proxy for rate limiting & real IP
app.set('trust proxy', 1);

// Security
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Logging
app.use(httpLogger);

// JSON Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic timeout (safe)
app.use(timeoutHandler(30000));

// ---------- SWAGGER ----------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UpSkillWay CMS + Auth API',
      version: '1.0.0',
      description: 'CMS + Authentication Service'
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Local development'
      }
    ]
  },
  apis: [
    path.resolve(process.cwd(), 'src/routes/*.ts'),
    path.resolve(process.cwd(), 'src/controllers/*.ts')
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Simple health endpoints (NO load/circuit logic)
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// ------------------ ROUTES ------------------
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

app.use('/api/v1/leads', leadRateLimit, leadRoutes);
app.use('/api/v1/cms', cmsRateLimit, cmsRoutes);

// ---------- Error Handlers ----------
app.use(validationErrorHandler);
app.use(databaseErrorHandler);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

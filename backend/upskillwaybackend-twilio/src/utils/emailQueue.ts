import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';
import { brevoClient, BrevoTransactionalEmail, BrevoCampaignData } from './brevoClient';

/**
 * Email Queue Manager
 * Handles async email sending using BullMQ and Redis
 * Falls back to direct email sending if Redis is unavailable
 */
export class EmailQueueManager {
  private redis: Redis | null = null;
  private transactionalQueue: Queue | null = null;
  private campaignQueue: Queue | null = null;
  private transactionalWorker: Worker | null = null;
  private campaignWorker: Worker | null = null;
  private redisAvailable: boolean = false;
  private lastErrorLogTime: number = 0;
  private readonly ERROR_LOG_INTERVAL = 60000; // Log errors at most once per minute

  constructor() {
    this.initializeRedis();
    // Queues and workers will be initialized when Redis connects (handled in initializeRedis)
    // If Redis is not available, emails will be sent directly via fallback logic
    if (!this.redis) {
      logger.warn('Email queue manager initialized without Redis. Emails will be sent directly.');
    }
  }

  /**
   * Initialize Redis connection with graceful error handling
   */
  private initializeRedis(): void {
    try {
      this.redis = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
        maxRetriesPerRequest: null, // Required by BullMQ
        lazyConnect: true,
        retryStrategy: (times) => {
          // Exponential backoff with max delay of 30 seconds
          const delay = Math.min(times * 50, 30000);
          return delay;
        },
        reconnectOnError: (err) => {
          // Only reconnect on specific errors
          const targetError = 'READONLY';
          return err.message.includes(targetError);
        },
        enableOfflineQueue: false, // Don't queue commands when disconnected
      });

      this.redis.on('connect', () => {
        this.redisAvailable = true;
        logger.info('Redis connected successfully for email queues');
      });

      this.redis.on('ready', () => {
        this.redisAvailable = true;
        logger.info('Redis is ready for email queues');
        // Initialize queues and workers when Redis becomes ready
        if (!this.transactionalQueue) {
          this.initializeQueues();
          this.initializeWorkers();
        }
      });

      this.redis.on('error', (error) => {
        this.redisAvailable = false;
        const now = Date.now();
        // Only log errors once per minute to avoid spam
        if (now - this.lastErrorLogTime > this.ERROR_LOG_INTERVAL) {
          logger.warn('Redis connection error (will retry silently):', {
            message: error.message,
            code: (error as any).code,
          });
          this.lastErrorLogTime = now;
        }
      });

      this.redis.on('close', () => {
        this.redisAvailable = false;
        logger.warn('Redis connection closed. Email queue unavailable.');
      });

      // Try to connect asynchronously (non-blocking)
      this.redis.connect().catch(() => {
        // Connection will be retried automatically via retryStrategy
        this.redisAvailable = false;
      });

      // Check connection status after a short delay
      setTimeout(async () => {
        try {
          if (this.redis && this.redis.status === 'ready') {
            this.redisAvailable = true;
            // Initialize queues and workers if not already done
            if (!this.transactionalQueue) {
              this.initializeQueues();
              this.initializeWorkers();
            }
          }
        } catch (error) {
          // Ignore errors during status check
        }
      }, 1000);
    } catch (error) {
      logger.warn('Failed to initialize Redis. Email queue will be unavailable:', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      this.redisAvailable = false;
      this.redis = null;
    }
  }

  /**
   * Initialize email queues
   */
  private initializeQueues(): void {
    if (!this.redis) {
      logger.warn('Cannot initialize queues: Redis not available');
      return;
    }

    try {
      // Transactional email queue
      this.transactionalQueue = new Queue('email-transactional', {
        connection: this.redis,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      });

      // Campaign email queue
      this.campaignQueue = new Queue('email-campaign', {
        connection: this.redis,
        defaultJobOptions: {
          removeOnComplete: 50,
          removeOnFail: 25,
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      });

      logger.info('Email queues initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email queues:', error);
      this.redisAvailable = false;
    }
  }

  /**
   * Initialize email workers
   */
  private initializeWorkers(): void {
    if (!this.redis || !this.transactionalQueue || !this.campaignQueue) {
      logger.warn('Cannot initialize workers: Redis or queues not available');
      return;
    }

    try {
      // Transactional email worker
      this.transactionalWorker = new Worker(
        'email-transactional',
        async (job: Job<TransactionalEmailJobData>) => {
          return await this.processTransactionalEmail(job);
        },
        {
          connection: this.redis,
          concurrency: 5,
        }
      );

      // Campaign email worker
      this.campaignWorker = new Worker(
        'email-campaign',
        async (job: Job<CampaignEmailJobData>) => {
          return await this.processCampaignEmail(job);
        },
        {
          connection: this.redis,
          concurrency: 2,
        }
      );

      // Add event listeners
      this.addWorkerEventListeners();

      logger.info('Email workers initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email workers:', error);
      this.redisAvailable = false;
    }
  }

  /**
   * Add event listeners for workers
   */
  private addWorkerEventListeners(): void {
    if (!this.transactionalWorker || !this.campaignWorker) {
      return;
    }

    // Transactional worker events
    this.transactionalWorker.on('completed', (job) => {
      logger.info('Transactional email job completed:', {
        jobId: job.id,
        to: job.data.to,
      });
    });

    this.transactionalWorker.on('failed', (job, err) => {
      logger.error('Transactional email job failed:', {
        jobId: job?.id,
        to: job?.data?.to,
        error: err.message,
      });
    });

    // Campaign worker events
    this.campaignWorker.on('completed', (job) => {
      logger.info('Campaign email job completed:', {
        jobId: job.id,
        campaignId: job.data.campaignId,
      });
    });

    this.campaignWorker.on('failed', (job, err) => {
      logger.error('Campaign email job failed:', {
        jobId: job?.id,
        campaignId: job?.data?.campaignId,
        error: err.message,
      });
    });
  }

  /**
   * Process transactional email job
   */
  private async processTransactionalEmail(job: Job<TransactionalEmailJobData>): Promise<any> {
    try {
      const { emailData, transport } = job.data;

      logger.info('Processing transactional email job:', {
        jobId: job.id,
        to: emailData.to,
        transport,
      });

      let result;
      if (transport === 'smtp') {
        result = await brevoClient.sendSmtpEmail(emailData);
      } else {
        result = await brevoClient.sendTransactionalEmail(emailData);
      }

      logger.info('Transactional email processed successfully:', {
        jobId: job.id,
        messageId: result.messageId,
      });

      return result;
    } catch (error) {
      logger.error('Failed to process transactional email job:', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Process campaign email job
   */
  private async processCampaignEmail(job: Job<CampaignEmailJobData>): Promise<any> {
    try {
      const { campaignData, action } = job.data;

      logger.info('Processing campaign email job:', {
        jobId: job.id,
        action,
        campaignName: campaignData.name,
      });

      let result;
      if (action === 'create') {
        result = await brevoClient.createEmailCampaign(campaignData);
      } else if (action === 'send') {
        result = await brevoClient.sendEmailCampaign(campaignData.campaignId!);
      } else {
        throw new Error(`Unknown campaign action: ${action}`);
      }

      logger.info('Campaign email processed successfully:', {
        jobId: job.id,
        result,
      });

      return result;
    } catch (error) {
      logger.error('Failed to process campaign email job:', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Add transactional email to queue
   * Falls back to direct sending if Redis is unavailable
   */
  async addTransactionalEmail(
    emailData: BrevoTransactionalEmail,
    transport: 'api' | 'smtp' = 'api',
    delay?: number
  ): Promise<Job<TransactionalEmailJobData> | any> {
    // If Redis is not available, send email directly
    if (!this.redisAvailable || !this.transactionalQueue) {
      logger.info('Redis unavailable, sending transactional email directly:', {
        to: emailData.to,
        transport,
      });

      try {
        let result;
        if (transport === 'smtp') {
          result = await brevoClient.sendSmtpEmail(emailData);
        } else {
          result = await brevoClient.sendTransactionalEmail(emailData);
        }

        logger.info('Transactional email sent directly:', {
          to: emailData.to,
          messageId: result.messageId,
        });

        return { id: 'direct', data: { emailData, transport }, result };
      } catch (error) {
        logger.error('Failed to send transactional email directly:', error);
        throw error;
      }
    }

    try {
      const job = await this.transactionalQueue.add(
        'send-transactional-email',
        {
          emailData,
          transport,
        },
        {
          delay: delay || 0,
          priority: 1,
        }
      );

      logger.info('Transactional email added to queue:', {
        jobId: job.id,
        to: emailData.to,
        transport,
      });

      return job;
    } catch (error) {
      logger.error('Failed to add transactional email to queue, sending directly:', error);
      // Fallback to direct sending
      try {
        if (transport === 'smtp') {
          return await brevoClient.sendSmtpEmail(emailData);
        } else {
          return await brevoClient.sendTransactionalEmail(emailData);
        }
      } catch (fallbackError) {
        logger.error('Failed to send email directly as fallback:', fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Add campaign email to queue
   * Falls back to direct sending if Redis is unavailable
   */
  async addCampaignEmail(
    campaignData: BrevoCampaignData,
    action: 'create' | 'send' = 'create',
    delay?: number
  ): Promise<Job<CampaignEmailJobData> | any> {
    // If Redis is not available, process campaign directly
    if (!this.redisAvailable || !this.campaignQueue) {
      logger.info('Redis unavailable, processing campaign email directly:', {
        action,
        campaignName: campaignData.name,
      });

      try {
        let result;
        if (action === 'create') {
          result = await brevoClient.createEmailCampaign(campaignData);
        } else if (action === 'send') {
          result = await brevoClient.sendEmailCampaign(campaignData.campaignId!);
        } else {
          throw new Error(`Unknown campaign action: ${action}`);
        }

        logger.info('Campaign email processed directly:', {
          action,
          campaignName: campaignData.name,
          result,
        });

        return { id: 'direct', data: { campaignData, action }, result };
      } catch (error) {
        logger.error('Failed to process campaign email directly:', error);
        throw error;
      }
    }

    try {
      const job = await this.campaignQueue.add(
        'process-campaign-email',
        {
          campaignData,
          action,
        },
        {
          delay: delay || 0,
          priority: 2,
        }
      );

      logger.info('Campaign email added to queue:', {
        jobId: job.id,
        action,
        campaignName: campaignData.name,
      });

      return job;
    } catch (error) {
      logger.error('Failed to add campaign email to queue, processing directly:', error);
      // Fallback to direct processing
      try {
        if (action === 'create') {
          return await brevoClient.createEmailCampaign(campaignData);
        } else if (action === 'send') {
          return await brevoClient.sendEmailCampaign(campaignData.campaignId!);
        } else {
          throw new Error(`Unknown campaign action: ${action}`);
        }
      } catch (fallbackError) {
        logger.error('Failed to process campaign directly as fallback:', fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<EmailQueueStats> {
    if (!this.redisAvailable || !this.transactionalQueue || !this.campaignQueue) {
      return {
        transactional: {
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
        },
        campaign: {
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
        },
        timestamp: new Date().toISOString(),
        redisAvailable: false,
      };
    }

    try {
      const [transactionalStats, campaignStats] = await Promise.all([
        this.transactionalQueue.getJobCounts(),
        this.campaignQueue.getJobCounts(),
      ]);

      return {
        transactional: {
          waiting: transactionalStats.waiting,
          active: transactionalStats.active,
          completed: transactionalStats.completed,
          failed: transactionalStats.failed,
        },
        campaign: {
          waiting: campaignStats.waiting,
          active: campaignStats.active,
          completed: campaignStats.completed,
          failed: campaignStats.failed,
        },
        timestamp: new Date().toISOString(),
        redisAvailable: true,
      };
    } catch (error) {
      logger.error('Failed to get queue statistics:', error);
      return {
        transactional: {
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
        },
        campaign: {
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
        },
        timestamp: new Date().toISOString(),
        redisAvailable: false,
      };
    }
  }

  /**
   * Get job by ID
   */
  async getJob(jobId: string, queueType: 'transactional' | 'campaign'): Promise<Job | null> {
    if (!this.redisAvailable) {
      return null;
    }

    try {
      const queue = queueType === 'transactional' ? this.transactionalQueue : this.campaignQueue;
      if (!queue) {
        return null;
      }
      const job = await queue.getJob(jobId);
      return job || null; // Convert undefined to null
    } catch (error) {
      logger.error('Failed to get job:', { jobId, queueType, error });
      return null;
    }
  }

  /**
   * Clean completed jobs
   */
  async cleanCompletedJobs(queueType: 'transactional' | 'campaign', maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.redisAvailable) {
      return;
    }

    try {
      const queue = queueType === 'transactional' ? this.transactionalQueue : this.campaignQueue;
      if (!queue) {
        return;
      }
      await queue.clean(maxAge, 100, 'completed');
      await queue.clean(maxAge, 100, 'failed');

      logger.info('Cleaned completed jobs:', { queueType, maxAge });
    } catch (error) {
      logger.error('Failed to clean completed jobs:', { queueType, error });
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    try {
      logger.info('Shutting down email queue manager...');

      const shutdownPromises: Promise<any>[] = [];

      if (this.transactionalWorker) {
        shutdownPromises.push(this.transactionalWorker.close());
      }
      if (this.campaignWorker) {
        shutdownPromises.push(this.campaignWorker.close());
      }
      if (this.transactionalQueue) {
        shutdownPromises.push(this.transactionalQueue.close());
      }
      if (this.campaignQueue) {
        shutdownPromises.push(this.campaignQueue.close());
      }
      if (this.redis) {
        this.redis.disconnect();
        shutdownPromises.push(Promise.resolve());
      }

      await Promise.all(shutdownPromises);

      logger.info('Email queue manager shutdown complete');
    } catch (error) {
      logger.error('Error during email queue manager shutdown:', error);
    }
  }
}

// Export types
export interface TransactionalEmailJobData {
  emailData: BrevoTransactionalEmail;
  transport: 'api' | 'smtp';
}

export interface CampaignEmailJobData {
  campaignData: BrevoCampaignData & { campaignId?: number };
  action: 'create' | 'send';
}

export interface EmailQueueStats {
  transactional: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  campaign: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  timestamp: string;
  redisAvailable?: boolean;
}

// Create and export singleton instance
export const emailQueueManager = new EmailQueueManager();
export default emailQueueManager;

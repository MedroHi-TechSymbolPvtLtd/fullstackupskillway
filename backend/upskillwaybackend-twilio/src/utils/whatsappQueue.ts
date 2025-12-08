import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';
import { twilioService } from '../services/twilioService';

export interface WhatsAppJobData {
    to: string;
    body?: string;
    mediaUrl?: string[];
    contentSid?: string;
    contentVariables?: Record<string, string>;
    type: 'manual' | 'automated';
}

export class WhatsAppQueueManager {
    private redis: Redis | null = null;
    private queue: Queue | null = null;
    private worker: Worker | null = null;
    private redisAvailable: boolean = false;

    constructor() {
        this.initializeRedis();
    }

    private initializeRedis() {
        try {
            this.redis = new Redis({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.password,
                db: config.redis.db,
                maxRetriesPerRequest: null,
                lazyConnect: true,
            });

            this.redis.on('connect', () => {
                this.redisAvailable = true;
                logger.info('Redis connected for WhatsApp queue');
                this.initializeQueue();
                this.initializeWorker();
            });

            this.redis.on('error', (err) => {
                this.redisAvailable = false;
                logger.error('Redis error in WhatsApp queue:', err);
            });

            this.redis.connect().catch(() => {
                this.redisAvailable = false;
            });

        } catch (error) {
            logger.error('Failed to initialize Redis for WhatsApp queue:', error);
        }
    }

    private initializeQueue() {
        if (!this.redis) return;

        this.queue = new Queue('whatsapp-message', {
            connection: this.redis,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: 100,
                removeOnFail: 100,
            },
        });
    }

    private initializeWorker() {
        if (!this.redis) return;

        this.worker = new Worker(
            'whatsapp-message',
            async (job: Job<WhatsAppJobData>) => {
                logger.info(`Processing WhatsApp job ${job.id}:`, job.data);
                await twilioService.sendMessage({
                    to: job.data.to,
                    body: job.data.body,
                    mediaUrl: job.data.mediaUrl,
                    contentSid: job.data.contentSid,
                    contentVariables: job.data.contentVariables
                });
            },
            {
                connection: this.redis,
                concurrency: 5,
                limiter: {
                    max: 10,
                    duration: 1000,
                },
            }
        );

        this.worker.on('completed', (job) => {
            logger.info(`WhatsApp job ${job.id} completed`);
        });

        this.worker.on('failed', (job, err) => {
            logger.error(`WhatsApp job ${job?.id} failed:`, err);
        });
    }

    async addMessage(data: WhatsAppJobData) {
        if (!this.redisAvailable || !this.queue) {
            logger.warn('Redis unavailable, sending WhatsApp message directly');
            return twilioService.sendMessage({
                to: data.to,
                body: data.body,
                mediaUrl: data.mediaUrl,
                contentSid: data.contentSid,
                contentVariables: data.contentVariables
            });
        }

        return this.queue.add('send-message', data);
    }

    async addBulkMessages(messages: WhatsAppJobData[]) {
        if (!this.redisAvailable || !this.queue) {
            logger.warn('Redis unavailable, sending bulk WhatsApp messages directly (sequential)');
            const results = [];
            for (const msg of messages) {
                try {
                    const res = await twilioService.sendMessage({
                        to: msg.to,
                        body: msg.body,
                        mediaUrl: msg.mediaUrl,
                        contentSid: msg.contentSid,
                        contentVariables: msg.contentVariables
                    });
                    results.push({ success: true, sid: res.sid });
                } catch (e) {
                    results.push({ success: false, error: e });
                }
            }
            return results;
        }

        const jobs = messages.map(msg => ({
            name: 'send-message',
            data: msg
        }));

        return this.queue.addBulk(jobs);
    }
}

export const whatsappQueueManager = new WhatsAppQueueManager();

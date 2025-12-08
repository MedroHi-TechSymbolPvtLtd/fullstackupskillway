import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Performance Monitoring and Metrics Collection
 * Tracks server performance, response times, and system metrics
 */

interface PerformanceMetrics {
  requestCount: number;
  totalResponseTime: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  errorCount: number;
  successCount: number;
  lastResetTime: number;
}

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    user: number;
    system: number;
  };
  uptime: number;
  loadAverage: number[];
}

interface EndpointMetrics {
  [endpoint: string]: {
    count: number;
    totalTime: number;
    averageTime: number;
    errorCount: number;
    lastAccessed: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private systemMetrics: SystemMetrics;
  private endpointMetrics: EndpointMetrics;
  private readonly maxHistorySize: number = 1000;
  private history: Array<{
    timestamp: number;
    responseTime: number;
    statusCode: number;
    endpoint: string;
  }> = [];

  constructor() {
    this.metrics = {
      requestCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      errorCount: 0,
      successCount: 0,
      lastResetTime: Date.now(),
    };

    this.systemMetrics = {
      memory: { used: 0, total: 0, percentage: 0 },
      cpu: { user: 0, system: 0 },
      uptime: 0,
      loadAverage: [],
    };

    this.endpointMetrics = {};

    // Start system metrics collection
    this.startSystemMetricsCollection();
  }

  // Record request metrics
  recordRequest(endpoint: string, responseTime: number, statusCode: number): void {
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.requestCount;
    
    this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, responseTime);
    this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, responseTime);

    if (statusCode >= 400) {
      this.metrics.errorCount++;
    } else {
      this.metrics.successCount++;
    }

    // Record endpoint-specific metrics
    if (!this.endpointMetrics[endpoint]) {
      this.endpointMetrics[endpoint] = {
        count: 0,
        totalTime: 0,
        averageTime: 0,
        errorCount: 0,
        lastAccessed: Date.now(),
      };
    }

    const endpointMetric = this.endpointMetrics[endpoint];
    endpointMetric.count++;
    endpointMetric.totalTime += responseTime;
    endpointMetric.averageTime = endpointMetric.totalTime / endpointMetric.count;
    endpointMetric.lastAccessed = Date.now();

    if (statusCode >= 400) {
      endpointMetric.errorCount++;
    }

    // Add to history
    this.history.push({
      timestamp: Date.now(),
      responseTime,
      statusCode,
      endpoint,
    });

    // Keep history size manageable
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }

    // Log slow requests
    if (responseTime > 5000) { // 5 seconds
      logger.warn('Slow request detected', {
        endpoint,
        responseTime,
        statusCode,
        timestamp: new Date().toISOString(),
      });
    }

    // Log high error rates
    const errorRate = this.metrics.errorCount / this.metrics.requestCount;
    if (this.metrics.requestCount > 100 && errorRate > 0.1) { // 10% error rate
      logger.warn('High error rate detected', {
        errorRate: Math.round(errorRate * 100),
        totalRequests: this.metrics.requestCount,
        errorCount: this.metrics.errorCount,
      });
    }
  }

  // Start system metrics collection
  private startSystemMetricsCollection(): void {
    setInterval(() => {
      this.updateSystemMetrics();
    }, 5000); // Update every 5 seconds
  }

  // Update system metrics
  private updateSystemMetrics(): void {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.systemMetrics.memory = {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
    };

    this.systemMetrics.cpu = {
      user: cpuUsage.user,
      system: cpuUsage.system,
    };

    this.systemMetrics.uptime = Math.floor(process.uptime());

    // Get load average (if available)
    try {
      this.systemMetrics.loadAverage = require('os').loadavg();
    } catch (error) {
      this.systemMetrics.loadAverage = [0, 0, 0];
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics & { system: SystemMetrics; endpoints: EndpointMetrics } {
    return {
      ...this.metrics,
      system: this.systemMetrics,
      endpoints: this.endpointMetrics,
    };
  }

  // Get performance summary
  getPerformanceSummary(): any {
    const uptime = process.uptime();
    const requestsPerSecond = this.metrics.requestCount / uptime;
    const errorRate = this.metrics.requestCount > 0 ? this.metrics.errorCount / this.metrics.requestCount : 0;

    return {
      summary: {
        uptime: Math.floor(uptime),
        totalRequests: this.metrics.requestCount,
        requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
        averageResponseTime: Math.round(this.metrics.averageResponseTime),
        errorRate: Math.round(errorRate * 100),
        successRate: Math.round((1 - errorRate) * 100),
      },
      performance: {
        minResponseTime: this.metrics.minResponseTime === Infinity ? 0 : this.metrics.minResponseTime,
        maxResponseTime: this.metrics.maxResponseTime,
        averageResponseTime: this.metrics.averageResponseTime,
      },
      system: this.systemMetrics,
      topEndpoints: this.getTopEndpoints(10),
    };
  }

  // Get top endpoints by request count
  getTopEndpoints(limit: number = 10): Array<{ endpoint: string; count: number; averageTime: number; errorRate: number }> {
    return Object.entries(this.endpointMetrics)
      .map(([endpoint, metrics]) => ({
        endpoint,
        count: metrics.count,
        averageTime: Math.round(metrics.averageTime),
        errorRate: Math.round((metrics.errorCount / metrics.count) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get recent history
  getRecentHistory(minutes: number = 60): Array<any> {
    const cutoffTime = Date.now() - (minutes * 60 * 1000);
    return this.history.filter(entry => entry.timestamp > cutoffTime);
  }

  // Reset metrics
  resetMetrics(): void {
    this.metrics = {
      requestCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      errorCount: 0,
      successCount: 0,
      lastResetTime: Date.now(),
    };

    this.endpointMetrics = {};
    this.history = [];
  }

  // Check if server is healthy
  isHealthy(): boolean {
    const memoryPercentage = this.systemMetrics.memory.percentage;
    const errorRate = this.metrics.requestCount > 0 ? this.metrics.errorCount / this.metrics.requestCount : 0;
    const averageResponseTime = this.metrics.averageResponseTime;

    return memoryPercentage < 90 && errorRate < 0.1 && averageResponseTime < 10000;
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Performance monitoring middleware
 */
export const performanceMonitoringMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const endpoint = `${req.method} ${req.path}`;

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    performanceMonitor.recordRequest(endpoint, responseTime, res.statusCode);
  });

  next();
};

/**
 * Performance metrics endpoint
 */
export const performanceMetricsEndpoint = (req: Request, res: Response): void => {
  const metrics = performanceMonitor.getMetrics();
  
  res.status(200).json({
    success: true,
    message: 'Performance metrics',
    data: {
      ...metrics,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Performance summary endpoint
 */
export const performanceSummaryEndpoint = (req: Request, res: Response): void => {
  const summary = performanceMonitor.getPerformanceSummary();
  
  res.status(200).json({
    success: true,
    message: 'Performance summary',
    data: summary,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Performance health check endpoint
 */
export const performanceHealthCheckEndpoint = (req: Request, res: Response): void => {
  const isHealthy = performanceMonitor.isHealthy();
  const summary = performanceMonitor.getPerformanceSummary();
  
  const statusCode = isHealthy ? 200 : 503;
  
  res.status(statusCode).json({
    success: isHealthy,
    message: isHealthy ? 'Server is performing well' : 'Server performance issues detected',
    data: {
      healthy: isHealthy,
      summary: summary.summary,
      system: summary.system,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Performance history endpoint
 */
export const performanceHistoryEndpoint = (req: Request, res: Response): void => {
  const minutes = parseInt(req.query.minutes as string) || 60;
  const history = performanceMonitor.getRecentHistory(minutes);
  
  res.status(200).json({
    success: true,
    message: `Performance history for last ${minutes} minutes`,
    data: {
      history,
      count: history.length,
      timeRange: `${minutes} minutes`,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Get performance monitor instance
 */
export const getPerformanceMonitor = (): PerformanceMonitor => {
  return performanceMonitor;
};

/**
 * Reset performance metrics
 */
export const resetPerformanceMetrics = (): void => {
  performanceMonitor.resetMetrics();
};

export default performanceMonitor;

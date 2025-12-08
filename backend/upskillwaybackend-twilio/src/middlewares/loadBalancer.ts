import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Load Balancer Middleware with Circuit Breaker Pattern
 * Handles high traffic scenarios and server health monitoring
 */

interface ServerMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: number;
  isHealthy: boolean;
}

interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  successCount: number;
}

class LoadBalancer {
  private metrics: ServerMetrics;
  private circuitBreaker: CircuitBreakerState;
  private readonly maxFailures: number = 5;
  private readonly timeoutMs: number = 60000; // 1 minute
  private readonly resetTimeoutMs: number = 30000; // 30 seconds

  constructor() {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      lastRequestTime: Date.now(),
      isHealthy: true,
    };

    this.circuitBreaker = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0,
    };
  }

  // Update server metrics
  updateMetrics(responseTime: number, isError: boolean = false): void {
    this.metrics.requestCount++;
    this.metrics.lastRequestTime = Date.now();
    
    if (isError) {
      this.metrics.errorCount++;
    }

    // Calculate rolling average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + responseTime) / 
      this.metrics.requestCount;

    // Update health status
    this.updateHealthStatus();
  }

  // Update circuit breaker state
  updateCircuitBreaker(isError: boolean): void {
    if (isError) {
      this.circuitBreaker.failureCount++;
      this.circuitBreaker.lastFailureTime = Date.now();

      if (this.circuitBreaker.failureCount >= this.maxFailures) {
        this.circuitBreaker.state = 'OPEN';
        logger.warn('Circuit breaker opened due to high failure rate');
      }
    } else {
      if (this.circuitBreaker.state === 'HALF_OPEN') {
        this.circuitBreaker.successCount++;
        if (this.circuitBreaker.successCount >= 3) {
          this.circuitBreaker.state = 'CLOSED';
          this.circuitBreaker.failureCount = 0;
          this.circuitBreaker.successCount = 0;
          logger.info('Circuit breaker closed - service recovered');
        }
      } else if (this.circuitBreaker.state === 'CLOSED') {
        this.circuitBreaker.failureCount = Math.max(0, this.circuitBreaker.failureCount - 1);
      }
    }

    // Check if we should transition to HALF_OPEN
    if (this.circuitBreaker.state === 'OPEN' && 
        Date.now() - this.circuitBreaker.lastFailureTime > this.resetTimeoutMs) {
      this.circuitBreaker.state = 'HALF_OPEN';
      this.circuitBreaker.successCount = 0;
      logger.info('Circuit breaker transitioning to HALF_OPEN');
    }
  }

  // Update health status based on metrics
  private updateHealthStatus(): void {
    const errorRate = this.metrics.errorCount / this.metrics.requestCount;
    const isHighErrorRate = errorRate > 0.1; // 10% error rate
    const isSlowResponse = this.metrics.averageResponseTime > 5000; // 5 seconds
    const isHighLoad = this.getServerLoad() > 0.9; // 90% memory usage

    this.metrics.isHealthy = !isHighErrorRate && !isSlowResponse && !isHighLoad;
  }

  // Get current server load
  private getServerLoad(): number {
    const memoryUsage = process.memoryUsage();
    return memoryUsage.heapUsed / memoryUsage.heapTotal;
  }

  // Check if circuit breaker allows requests
  canProcessRequest(): boolean {
    // Temporarily disable circuit breaker for development
    // TODO: Re-enable with proper configuration in production
    return true;
    
    // Original circuit breaker logic (commented out for now)
    /*
    if (this.circuitBreaker.state === 'CLOSED') {
      return true;
    }

    if (this.circuitBreaker.state === 'OPEN') {
      return false;
    }

    if (this.circuitBreaker.state === 'HALF_OPEN') {
      return true; // Allow limited requests to test recovery
    }

    return false;
    */
  }

  // Get current metrics
  getMetrics(): ServerMetrics & { circuitBreaker: CircuitBreakerState } {
    return {
      ...this.metrics,
      circuitBreaker: { ...this.circuitBreaker },
    };
  }

  // Reset metrics (for testing or maintenance)
  resetMetrics(): void {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      lastRequestTime: Date.now(),
      isHealthy: true,
    };
  }

  // Reset circuit breaker (for testing or maintenance)
  resetCircuitBreaker(): void {
    this.circuitBreaker = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0,
    };
  }
}

// Global load balancer instance
const loadBalancer = new LoadBalancer();

/**
 * Load Balancer Middleware
 * Monitors request performance and implements circuit breaker pattern
 */
export const loadBalancerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Check circuit breaker
  if (!loadBalancer.canProcessRequest()) {
    logger.warn('Request blocked by circuit breaker', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable due to high load',
      error: 'CIRCUIT_BREAKER_OPEN',
      timestamp: new Date().toISOString(),
      retryAfter: 30,
    });
    return;
  }

  // Add response time tracking
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const isError = res.statusCode >= 400;
    
    loadBalancer.updateMetrics(responseTime, isError);
    loadBalancer.updateCircuitBreaker(isError);

    // Log slow requests
    if (responseTime > 3000) { // 3 seconds
      logger.warn('Slow request detected', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        responseTime,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Health Check Middleware
 * Provides detailed health information for load balancers
 */
export const healthCheckMiddleware = (req: Request, res: Response): void => {
  const metrics = loadBalancer.getMetrics();
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  const healthStatus = {
    status: metrics.isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    metrics: {
      requestCount: metrics.requestCount,
      errorCount: metrics.errorCount,
      errorRate: metrics.requestCount > 0 ? metrics.errorCount / metrics.requestCount : 0,
      averageResponseTime: Math.round(metrics.averageResponseTime),
      lastRequestTime: new Date(metrics.lastRequestTime).toISOString(),
    },
    circuitBreaker: {
      state: metrics.circuitBreaker.state,
      failureCount: metrics.circuitBreaker.failureCount,
      successCount: metrics.circuitBreaker.successCount,
    },
    system: {
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      },
      cpu: process.cpuUsage(),
      pid: process.pid,
    },
    environment: config.nodeEnv,
    version: '1.0.0',
  };

  const statusCode = metrics.isHealthy ? 200 : 503;
  res.status(statusCode).json(healthStatus);
};

/**
 * Metrics Endpoint Middleware
 * Provides detailed metrics for monitoring systems
 */
export const metricsMiddleware = (req: Request, res: Response): void => {
  const metrics = loadBalancer.getMetrics();
  
  res.status(200).json({
    success: true,
    message: 'Server metrics',
    data: {
      ...metrics,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Graceful Degradation Middleware
 * Reduces functionality under high load
 */
export const gracefulDegradationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const metrics = loadBalancer.getMetrics();
  const serverLoad = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;

  // Add headers indicating server load
  res.set('X-Server-Load', Math.round(serverLoad * 100).toString());
  res.set('X-Circuit-Breaker-State', metrics.circuitBreaker.state);

  // Reduce response payload for high-load scenarios
  if (serverLoad > 0.8) {
    res.set('X-Degraded-Mode', 'true');
    
    // For GET requests, add cache headers
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
  }

  next();
};

/**
 * Request Throttling Middleware
 * Implements intelligent throttling based on server load
 */
export const intelligentThrottlingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Disable throttling in development environment
  if (process.env.NODE_ENV === 'development') {
    next();
    return;
  }

  const metrics = loadBalancer.getMetrics();
  const serverLoad = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;

  // Skip throttling for health checks
  if (req.path === '/health' || req.path === '/health/detailed') {
    next();
    return;
  }

  // Throttle based on server load (less aggressive for development)
  if (serverLoad > 0.95) {
    // Very high load - aggressive throttling (only at 95%+ memory usage)
    const throttleProbability = 0.5; // 50% chance of throttling
    if (Math.random() < throttleProbability) {
      res.status(429).json({
        success: false,
        message: 'Server under extreme load. Please try again later.',
        error: 'SERVER_OVERLOAD',
        timestamp: new Date().toISOString(),
        retryAfter: 60,
      });
      return;
    }
  } else if (serverLoad > 0.9) {
    // High load - moderate throttling (only at 90%+ memory usage)
    const throttleProbability = 0.1; // 10% chance of throttling
    if (Math.random() < throttleProbability) {
      res.status(429).json({
        success: false,
        message: 'Server under high load. Please try again later.',
        error: 'HIGH_LOAD',
        timestamp: new Date().toISOString(),
        retryAfter: 30,
      });
      return;
    }
  }

  next();
};

/**
 * Load Balancer Status Checker
 * Provides current load balancer status
 */
export const getLoadBalancerStatus = () => {
  return loadBalancer.getMetrics();
};

/**
 * Debug endpoint to check load balancer status
 */
export const loadBalancerDebugEndpoint = (req: Request, res: Response): void => {
  const metrics = loadBalancer.getMetrics();
  const serverLoad = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;
  
  res.status(200).json({
    success: true,
    message: 'Load balancer debug info',
    data: {
      ...metrics,
      serverLoad: Math.round(serverLoad * 100),
      canProcessRequest: loadBalancer.canProcessRequest(),
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Reset Load Balancer Metrics
 * For testing or maintenance purposes
 */
export const resetLoadBalancerMetrics = () => {
  loadBalancer.resetMetrics();
};

/**
 * Reset Circuit Breaker
 * For testing or maintenance purposes
 */
export const resetCircuitBreaker = () => {
  loadBalancer.resetCircuitBreaker();
};

export default loadBalancer;

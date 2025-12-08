import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General rate limiter for all requests
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset requests, please try again later.',
  skipSuccessfulRequests: false,
});

// Rate limiter for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'API rate limit exceeded.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: 'Too many file uploads, please try again later.',
});

// Rate limiter for order creation
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 orders per hour
  message: 'Too many orders placed, please try again later.',
});

// Dynamic rate limiter based on user role
export const createDynamicLimiter = (options: {
  windowMs?: number;
  maxForUser?: number;
  maxForAdmin?: number;
  maxForGuest?: number;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: (req: Request) => {
      // Check if user is authenticated and their role
      const user = (req as any).user;
      const seller = (req as any).seller;
      
      if (seller || (user && user.role === 'admin')) {
        return options.maxForAdmin || 200;
      } else if (user) {
        return options.maxForUser || 100;
      } else {
        return options.maxForGuest || 50;
      }
    },
    message: 'Rate limit exceeded for your account type.',
  });
};
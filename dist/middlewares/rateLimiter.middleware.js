"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamicLimiter = exports.orderLimiter = exports.uploadLimiter = exports.apiLimiter = exports.passwordResetLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// General rate limiter for all requests
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // 100 requests per window
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        var _a;
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
            // express-rate-limit augments the request at runtime; cast to any for TS
            retryAfter: (_a = req.rateLimit) === null || _a === void 0 ? void 0 : _a.resetTime,
        });
    },
});
// Strict rate limiter for authentication endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: "Too many authentication attempts, please try again later.",
    skipSuccessfulRequests: true, // Don't count successful requests
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiter for password reset
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per hour
    message: "Too many password reset requests, please try again later.",
    skipSuccessfulRequests: false,
});
// Rate limiter for API endpoints
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: "API rate limit exceeded.",
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiter for file uploads
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 uploads per window
    message: "Too many file uploads, please try again later.",
});
// Rate limiter for order creation
exports.orderLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 orders per hour
    message: "Too many orders placed, please try again later.",
});
// Dynamic rate limiter based on user role
const createDynamicLimiter = (options) => {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: (req) => {
            // Check if user is authenticated and their role
            const user = req.user;
            const seller = req.seller;
            if (seller || (user && user.role === "admin")) {
                return options.maxForAdmin || 200;
            }
            else if (user) {
                return options.maxForUser || 100;
            }
            else {
                return options.maxForGuest || 50;
            }
        },
        message: "Rate limit exceeded for your account type.",
    });
};
exports.createDynamicLimiter = createDynamicLimiter;

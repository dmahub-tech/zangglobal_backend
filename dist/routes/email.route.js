"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = require("../controllers/email.controller");
const auth_middleware_1 = require("../middleware/auth.middleware"); // Assume you have auth middleware
const admin_middleware_1 = require("../middleware/admin.middleware"); // Assume you have admin middleware
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const emailController = new email_controller_1.EmailController();
// Rate limiting for email endpoints
const emailRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 email requests per windowMs
    message: {
        success: false,
        message: "Too many email requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const bulkEmailRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1, // Only 1 bulk email per hour
    message: {
        success: false,
        message: "Bulk emails can only be sent once per hour.",
    },
});
// Public routes (no authentication required)
// Test email connection - useful for health checks
router.get("/test-connection", emailController.testEmailConnection);
// Send test email - for testing purposes
router.post("/test", emailRateLimit, emailController.sendTestEmail);
// Send complaint confirmation email
router.post("/complaint-confirmation", emailRateLimit, email_controller_1.EmailController.validateComplaintEmail, emailController.sendComplaintConfirmation);
// Send welcome email (usually triggered after user registration)
router.post("/welcome", emailRateLimit, email_controller_1.EmailController.validateWelcomeEmail, emailController.sendWelcomeEmail);
// Send password reset email
router.post("/password-reset", emailRateLimit, email_controller_1.EmailController.validatePasswordReset, emailController.sendPasswordResetEmail);
// Protected routes (authentication required)
// Order status emails - these would typically be triggered by your order management system
router.post("/order/processing", auth_middleware_1.authMiddleware, emailRateLimit, email_controller_1.EmailController.validateOrderEmail, emailController.sendOrderProcessing);
router.post("/order/shipped", auth_middleware_1.authMiddleware, emailRateLimit, email_controller_1.EmailController.validateOrderEmail, emailController.sendOrderShipped);
router.post("/order/out-for-delivery", auth_middleware_1.authMiddleware, emailRateLimit, email_controller_1.EmailController.validateOrderEmail, emailController.sendOrderOutForDelivery);
router.post("/order/delivered", auth_middleware_1.authMiddleware, emailRateLimit, email_controller_1.EmailController.validateOrderEmail, emailController.sendOrderDelivered);
// Newsletter email
router.post("/newsletter", auth_middleware_1.authMiddleware, emailRateLimit, email_controller_1.EmailController.validateNewsletter, emailController.sendNewsletterEmail);
// Admin only routes
// Send bulk emails to all users - admin only
router.post("/bulk", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, bulkEmailRateLimit, email_controller_1.EmailController.validateBulkEmail, emailController.sendBulkEmails);
// Get available email templates
router.get("/templates", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, emailController.getEmailTemplates);
exports.default = router;

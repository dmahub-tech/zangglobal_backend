"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.reviewValidation = exports.cartValidation = exports.orderValidation = exports.productValidation = exports.authValidation = exports.validationSchemas = exports.validate = exports.validateRequest = void 0;
const zod_1 = require("zod");
const express_validator_1 = require("express-validator");
// Zod validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors,
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error during validation',
            });
        }
    });
};
exports.validateRequest = validateRequest;
// Express-validator middleware wrapper
const validate = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
            return;
        }
        next();
    });
};
exports.validate = validate;
// Common validation schemas
exports.validationSchemas = {
    // MongoDB ObjectId validation
    mongoId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    // Email validation
    email: zod_1.z.string().email('Invalid email address').toLowerCase(),
    // Password validation
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    // Phone validation
    phone: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    // Pagination
    pagination: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(100).default(10),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    }),
    // Price validation
    price: zod_1.z.number().positive('Price must be positive').multipleOf(0.01),
    // Quantity validation
    quantity: zod_1.z.number().int().positive('Quantity must be a positive integer'),
    // URL validation
    url: zod_1.z.string().url('Invalid URL format'),
    // Date validation
    date: zod_1.z.string().datetime('Invalid date format'),
};
// Authentication validation schemas
exports.authValidation = {
    register: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
            email: exports.validationSchemas.email,
            password: exports.validationSchemas.password,
            phone: exports.validationSchemas.phone.optional(),
        }),
    }),
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: exports.validationSchemas.email,
            password: zod_1.z.string().min(1, 'Password is required'),
        }),
    }),
    forgotPassword: zod_1.z.object({
        body: zod_1.z.object({
            email: exports.validationSchemas.email,
        }),
    }),
    resetPassword: zod_1.z.object({
        body: zod_1.z.object({
            token: zod_1.z.string().min(1, 'Token is required'),
            password: exports.validationSchemas.password,
        }),
    }),
    changePassword: zod_1.z.object({
        body: zod_1.z.object({
            currentPassword: zod_1.z.string().min(1, 'Current password is required'),
            newPassword: exports.validationSchemas.password,
        }),
    }),
};
// Product validation schemas
exports.productValidation = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(2, 'Product name must be at least 2 characters'),
            description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
            price: exports.validationSchemas.price,
            category: zod_1.z.string().min(1, 'Category is required'),
            inStockValue: exports.validationSchemas.quantity,
            img: zod_1.z.array(zod_1.z.string().url()).min(1, 'At least one image is required'),
            discount: zod_1.z.number().min(0).max(100).optional(),
            isActive: zod_1.z.boolean().default(true),
        }),
    }),
    update: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.validationSchemas.mongoId,
        }),
        body: zod_1.z.object({
            name: zod_1.z.string().min(2).optional(),
            description: zod_1.z.string().min(10).optional(),
            price: exports.validationSchemas.price.optional(),
            category: zod_1.z.string().optional(),
            inStockValue: exports.validationSchemas.quantity.optional(),
            img: zod_1.z.array(zod_1.z.string().url()).optional(),
            discount: zod_1.z.number().min(0).max(100).optional(),
            isActive: zod_1.z.boolean().optional(),
        }),
    }),
    getById: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.validationSchemas.mongoId,
        }),
    }),
    list: zod_1.z.object({
        query: exports.validationSchemas.pagination.extend({
            category: zod_1.z.string().optional(),
            search: zod_1.z.string().optional(),
            minPrice: zod_1.z.coerce.number().optional(),
            maxPrice: zod_1.z.coerce.number().optional(),
            inStock: zod_1.z.coerce.boolean().optional(),
        }),
    }),
};
// Order validation schemas
exports.orderValidation = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            userId: exports.validationSchemas.mongoId,
            items: zod_1.z.array(zod_1.z.object({
                productId: exports.validationSchemas.mongoId,
                quantity: exports.validationSchemas.quantity,
                price: exports.validationSchemas.price,
            })).min(1, 'At least one item is required'),
            shippingAddress: zod_1.z.object({
                street: zod_1.z.string().min(1),
                city: zod_1.z.string().min(1),
                state: zod_1.z.string().min(1),
                country: zod_1.z.string().min(1),
                postalCode: zod_1.z.string().min(1),
            }),
            paymentMethod: zod_1.z.enum(['card', 'paypal', 'cash_on_delivery']),
            totalAmount: exports.validationSchemas.price,
        }),
    }),
    updateStatus: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.validationSchemas.mongoId,
        }),
        body: zod_1.z.object({
            status: zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            trackingNumber: zod_1.z.string().optional(),
        }),
    }),
    getById: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.validationSchemas.mongoId,
        }),
    }),
};
// Cart validation schemas
exports.cartValidation = {
    addItem: zod_1.z.object({
        body: zod_1.z.object({
            userId: exports.validationSchemas.mongoId,
            productId: exports.validationSchemas.mongoId,
            quantity: exports.validationSchemas.quantity,
        }),
    }),
    updateItem: zod_1.z.object({
        params: zod_1.z.object({
            userId: exports.validationSchemas.mongoId,
            productId: exports.validationSchemas.mongoId,
        }),
        body: zod_1.z.object({
            quantity: exports.validationSchemas.quantity,
        }),
    }),
    removeItem: zod_1.z.object({
        params: zod_1.z.object({
            userId: exports.validationSchemas.mongoId,
            productId: exports.validationSchemas.mongoId,
        }),
    }),
    getCart: zod_1.z.object({
        params: zod_1.z.object({
            userId: exports.validationSchemas.mongoId,
        }),
    }),
};
// Review validation schemas
exports.reviewValidation = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            productId: exports.validationSchemas.mongoId,
            userId: exports.validationSchemas.mongoId,
            rating: zod_1.z.number().min(1).max(5),
            comment: zod_1.z.string().min(10, 'Comment must be at least 10 characters'),
        }),
    }),
    update: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.validationSchemas.mongoId,
        }),
        body: zod_1.z.object({
            rating: zod_1.z.number().min(1).max(5).optional(),
            comment: zod_1.z.string().min(10).optional(),
        }),
    }),
    delete: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.validationSchemas.mongoId,
        }),
    }),
    getByProduct: zod_1.z.object({
        params: zod_1.z.object({
            productId: exports.validationSchemas.mongoId,
        }),
        query: exports.validationSchemas.pagination,
    }),
};
// Sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Recursively sanitize object
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            if (typeof obj === 'string') {
                // Remove potential XSS vectors
                return obj
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '')
                    .trim();
            }
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Remove keys that start with $ to prevent MongoDB injection
                if (!key.startsWith('$')) {
                    sanitized[key] = sanitize(obj[key]);
                }
            }
        }
        return sanitized;
    };
    // Sanitize request data
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
};
exports.sanitizeInput = sanitizeInput;
exports.default = {
    validateRequest: exports.validateRequest,
    validate: exports.validate,
    sanitizeInput: exports.sanitizeInput,
    schemas: {
        auth: exports.authValidation,
        product: exports.productValidation,
        order: exports.orderValidation,
        cart: exports.cartValidation,
        review: exports.reviewValidation,
    },
};

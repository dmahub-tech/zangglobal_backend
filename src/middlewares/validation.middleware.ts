import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";
import { validationResult, ValidationChain } from "express-validator";

// Zod validation middleware
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue: z.ZodIssue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};

// Express-validator middleware wrapper
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }
    next();
  };
};

// Common validation schemas
export const validationSchemas = {
  // MongoDB ObjectId validation
  mongoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),

  // Email validation
  email: z.string().email("Invalid email address").toLowerCase(),

  // Password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),

  // Phone validation
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("desc"),
  }),

  // Price validation
  price: z.number().positive("Price must be positive").multipleOf(0.01),

  // Quantity validation
  quantity: z.number().int().positive("Quantity must be a positive integer"),

  // URL validation
  url: z.string().url("Invalid URL format"),

  // Date validation
  date: z.string().datetime("Invalid date format"),
};

// Authentication validation schemas
export const authValidation = {
  register: z.object({
    body: z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: validationSchemas.email,
      password: validationSchemas.password,
      phone: validationSchemas.phone.optional(),
    }),
  }),

  login: z.object({
    body: z.object({
      email: validationSchemas.email,
      password: z.string().min(1, "Password is required"),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: validationSchemas.email,
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, "Token is required"),
      password: validationSchemas.password,
    }),
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: validationSchemas.password,
    }),
  }),
};

// Product validation schemas
export const productValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(2, "Product name must be at least 2 characters"),
      description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
      price: validationSchemas.price,
      category: z.string().min(1, "Category is required"),
      inStockValue: validationSchemas.quantity,
      img: z.array(z.string().url()).min(1, "At least one image is required"),
      discount: z.number().min(0).max(100).optional(),
      isActive: z.boolean().default(true),
    }),
  }),

  update: z.object({
    params: z.object({
      id: validationSchemas.mongoId,
    }),
    body: z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(10).optional(),
      price: validationSchemas.price.optional(),
      category: z.string().optional(),
      inStockValue: validationSchemas.quantity.optional(),
      img: z.array(z.string().url()).optional(),
      discount: z.number().min(0).max(100).optional(),
      isActive: z.boolean().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: validationSchemas.mongoId,
    }),
  }),

  list: z.object({
    query: validationSchemas.pagination.extend({
      category: z.string().optional(),
      search: z.string().optional(),
      minPrice: z.coerce.number().optional(),
      maxPrice: z.coerce.number().optional(),
      inStock: z.coerce.boolean().optional(),
    }),
  }),
};

// Order validation schemas
export const orderValidation = {
  create: z.object({
    body: z.object({
      userId: validationSchemas.mongoId,
      items: z
        .array(
          z.object({
            productId: validationSchemas.mongoId,
            quantity: validationSchemas.quantity,
            price: validationSchemas.price,
          })
        )
        .min(1, "At least one item is required"),
      shippingAddress: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        country: z.string().min(1),
        postalCode: z.string().min(1),
      }),
      paymentMethod: z.enum(["card", "paypal", "cash_on_delivery"]),
      totalAmount: validationSchemas.price,
    }),
  }),

  updateStatus: z.object({
    params: z.object({
      id: validationSchemas.mongoId,
    }),
    body: z.object({
      status: z.enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
      trackingNumber: z.string().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: validationSchemas.mongoId,
    }),
  }),
};

// Cart validation schemas
export const cartValidation = {
  addItem: z.object({
    body: z.object({
      userId: validationSchemas.mongoId,
      productId: validationSchemas.mongoId,
      quantity: validationSchemas.quantity,
    }),
  }),

  updateItem: z.object({
    params: z.object({
      userId: validationSchemas.mongoId,
      productId: validationSchemas.mongoId,
    }),
    body: z.object({
      quantity: validationSchemas.quantity,
    }),
  }),

  removeItem: z.object({
    params: z.object({
      userId: validationSchemas.mongoId,
      productId: validationSchemas.mongoId,
    }),
  }),

  getCart: z.object({
    params: z.object({
      userId: validationSchemas.mongoId,
    }),
  }),
};

// Review validation schemas
export const reviewValidation = {
  create: z.object({
    body: z.object({
      productId: validationSchemas.mongoId,
      userId: validationSchemas.mongoId,
      rating: z.number().min(1).max(5),
      comment: z.string().min(10, "Comment must be at least 10 characters"),
    }),
  }),

  update: z.object({
    params: z.object({
      id: validationSchemas.mongoId,
    }),
    body: z.object({
      rating: z.number().min(1).max(5).optional(),
      comment: z.string().min(10).optional(),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: validationSchemas.mongoId,
    }),
  }),

  getByProduct: z.object({
    params: z.object({
      productId: validationSchemas.mongoId,
    }),
    query: validationSchemas.pagination,
  }),
};

// Sanitization middleware
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Recursively sanitize object
  const sanitize = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) {
      if (typeof obj === "string") {
        // Remove potential XSS vectors
        return obj
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+\s*=/gi, "")
          .trim();
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Remove keys that start with $ to prevent MongoDB injection
        if (!key.startsWith("$")) {
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

export default {
  validateRequest,
  validate,
  sanitizeInput,
  schemas: {
    auth: authValidation,
    product: productValidation,
    order: orderValidation,
    cart: cartValidation,
    review: reviewValidation,
  },
};

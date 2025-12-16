"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
// Tell winston about the colors
winston_1.default.addColors(colors);
// Define log format
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Define transports
const transports = [
    // Console transport (always enabled in development)
    new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }),
];
// Add file transport in production
if (process.env.NODE_ENV === 'production') {
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(__dirname, '../../logs/error.log'),
        level: 'error',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    }), new winston_1.default.transports.File({
        filename: path_1.default.join(__dirname, '../../logs/combined.log'),
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    }));
}
// Create the logger
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
    levels,
    format,
    transports,
    exitOnError: false,
});
// Create a stream for Morgan middleware
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
// Export logger methods
exports.default = {
    error: (message, meta) => logger.error(meta ? `${message} ${JSON.stringify(meta)}` : message),
    warn: (message, meta) => logger.warn(meta ? `${message} ${JSON.stringify(meta)}` : message),
    info: (message, meta) => logger.info(meta ? `${message} ${JSON.stringify(meta)}` : message),
    http: (message, meta) => logger.http(meta ? `${message} ${JSON.stringify(meta)}` : message),
    debug: (message, meta) => logger.debug(meta ? `${message} ${JSON.stringify(meta)}` : message),
};
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
});

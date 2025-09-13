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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const db_1 = require("./config/db");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const complaint_route_1 = __importDefault(require("./routes/complaint.route"));
const coupon_route_1 = __importDefault(require("./routes/coupon.route"));
const image_route_1 = __importDefault(require("./routes/image.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const seller_route_1 = __importDefault(require("./routes/seller.route"));
const attendant_route_1 = __importDefault(require("./routes/attendant.route"));
const image_route_2 = __importDefault(require("./routes/image.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cron_route_1 = __importDefault(require("./routes/cron.route"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const uploadsDir = path_1.default.join(__dirname, "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at ${uploadsDir}`);
}
// Configure express-fileupload middleware
app.use((0, express_fileupload_1.default)({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use((err, req, res, next) => {
    console.error("Request body:", req.body);
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
// Middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cors_1.default)());
// Routes
app.use("/auth", auth_route_1.default);
app.use("/carts", cart_route_1.default);
app.use("/complaints", complaint_route_1.default);
app.use("/coupons", coupon_route_1.default);
app.use("/platforms", image_route_1.default);
app.use("/orders", order_route_1.default);
app.use("/attendance", attendant_route_1.default);
app.use("/products", product_route_1.default);
app.use("/reviews", review_route_1.default);
app.use("/admin", seller_route_1.default);
app.use("/upload", image_route_2.default);
app.use("/payments", payment_route_1.default);
app.use("/blogs", blog_route_1.default);
app.use('/cron', cron_route_1.default);
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
});
startServer();
exports.default = app;

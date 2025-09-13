"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_controller_1 = __importDefault(require("../controllers/seller.controller"));
const authenticate_seller_middleware_1 = require("../middlewares/authenticate-seller.middleware");
const router = express_1.default.Router();
const sellerController = new seller_controller_1.default();
// Public routes
router.post("/register", sellerController.register.bind(sellerController));
router.post("/login", sellerController.login.bind(sellerController));
router.post("/verify-otp", sellerController.verifyOtp.bind(sellerController));
router.post("/resend-otp", sellerController.resendOtp.bind(sellerController));
// Protected routes (require authentication)
router.get("/profile", authenticate_seller_middleware_1.authenticateSeller, sellerController.getProfile.bind(sellerController));
router.put("/profile", authenticate_seller_middleware_1.authenticateSeller, sellerController.updateProfile.bind(sellerController));
router.post("/change-password", authenticate_seller_middleware_1.authenticateSeller, sellerController.changePassword.bind(sellerController));
router.post("/logout", authenticate_seller_middleware_1.authenticateSeller, sellerController.logout.bind(sellerController));
router.delete("/account", authenticate_seller_middleware_1.authenticateSeller, sellerController.deleteAccount.bind(sellerController));
// controlling users
router.get("/users", authenticate_seller_middleware_1.authenticateSeller, sellerController.getAllUsers.bind(sellerController));
router.get("/orders", authenticate_seller_middleware_1.authenticateSeller, sellerController.getAllOrders.bind(sellerController));
exports.default = router;

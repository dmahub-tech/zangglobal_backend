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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const enums_1 = require("../enums");
const uuid_1 = require("uuid");
class SellerController {
    generateToken(sellerId) {
        return jsonwebtoken_1.default.sign({ sellerId }, process.env.JWT_SECRET || "your-secret-key", {
            expiresIn: "24h",
        });
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    mapSellerToResponseDTO(seller) {
        return {
            id: seller._id,
            name: seller.name,
            email: seller.email,
            sellerId: seller.sellerId,
            emailVerified: seller.emailVerified,
            phoneVerified: seller.phoneVerified,
            phoneNumber: seller.phoneNumber,
            businessName: seller.businessName,
            businessAddress: seller.businessAddress,
            businessType: seller.businessType,
        };
    }
    /**
     * Register a new seller
     */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerData = req.body;
                // Check if email already exists
                const existingSeller = yield models_1.Seller.findOne({ email: sellerData.email });
                if (existingSeller) {
                    res.status(400).json({
                        success: false,
                        message: "Email already registered",
                    });
                    return;
                }
                // Hash password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(sellerData.password, salt);
                // Create seller
                const seller = new models_1.Seller(Object.assign(Object.assign({}, sellerData), { password: hashedPassword, sellerId: (0, uuid_1.v4)() }));
                yield seller.save();
                const token = this.generateToken(seller.sellerId);
                res.status(201).json({
                    success: true,
                    message: "Seller registered successfully",
                    data: {
                        token,
                        seller,
                    },
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to register seller",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Login seller
     */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Find user
                const seller = yield models_1.Seller.findOne({ email });
                if (!seller) {
                    res.status(401).json({ status: false, message: "Invalid credentials" });
                    return;
                }
                // Verify password
                const isPasswordValid = yield seller.comparePassword(password);
                if (!isPasswordValid) {
                    res.status(401).json({ status: false, message: "Invalid credentials" });
                    return;
                }
                // Set loggedin state
                seller.loggedIn = enums_1.ELoginStatus.LOGGED_IN;
                yield seller.save();
                // Generate token
                const token = this.generateToken(seller.sellerId);
                res.status(200).json({
                    status: true,
                    token,
                    seller,
                    message: "Login successfully",
                });
            }
            catch (error) {
                console.error("Login error:", error);
                res.status(500).json({
                    success: false,
                    message: "Login failed",
                    error: error || "Unknown error occurred",
                });
                return;
            }
        });
    }
    /**
     * Verify OTP (email or phone)
     */
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, type } = req.body;
                // Find seller by email
                const seller = yield models_1.Seller.findOne({ email });
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                // Verify OTP
                if (seller.otp !== otp) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid OTP",
                    });
                    return;
                }
                // Update verification status based on type
                if (type === "email") {
                    seller.emailVerified = true;
                }
                else if (type === "phone") {
                    seller.phoneVerified = true;
                }
                // Clear OTP after verification
                seller.otp = undefined;
                yield seller.save();
                res.status(200).json({
                    success: true,
                    message: `${type} verified successfully`,
                    data: {
                        seller: this.mapSellerToResponseDTO(seller),
                    },
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Verification failed",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Logout seller
     */
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.seller.id;
                // Find seller by ID
                const seller = yield models_1.Seller.findById(sellerId);
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                // Update login status
                seller.loggedIn = enums_1.ELoginStatus.LOGGED_OUT;
                yield seller.save();
                res.status(200).json({
                    success: true,
                    message: "Logout successful",
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Logout failed",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Get seller profile
     */
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.seller.id;
                // Find seller by ID
                const seller = yield models_1.Seller.findById(sellerId);
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Seller profile retrieved successfully",
                    data: {
                        seller: this.mapSellerToResponseDTO(seller),
                    },
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to retrieve profile",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Update seller profile
     */
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.seller.id;
                const updateData = req.body;
                // Find and update seller
                const seller = yield models_1.Seller.findByIdAndUpdate(sellerId, updateData, {
                    new: true,
                    runValidators: true,
                });
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: {
                        seller: this.mapSellerToResponseDTO(seller),
                    },
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to update profile",
                    error: error.message,
                });
            }
        });
    }
    /**
     * Change password
     */
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.seller.id;
                const { currentPassword, newPassword } = req.body;
                // Find seller by ID
                const seller = yield models_1.Seller.findById(sellerId);
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                // Verify current password
                const isPasswordValid = yield seller.comparePassword(currentPassword);
                if (!isPasswordValid) {
                    res.status(401).json({
                        success: false,
                        message: "Current password is incorrect",
                    });
                    return;
                }
                // Update password
                seller.password = newPassword;
                yield seller.save();
                res.status(200).json({
                    success: true,
                    message: "Password changed successfully",
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to change password",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Resend OTP
     */
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, type } = req.body;
                // Find seller by email
                const seller = yield models_1.Seller.findOne({ email });
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                // Generate new OTP
                seller.otp = this.generateOTP();
                yield seller.save();
                // TODO: Send OTP via email or SMS based on type
                res.status(200).json({
                    success: true,
                    message: `OTP sent to your ${type}`,
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to send OTP",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Delete seller account
     */
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.seller.id;
                // Find and delete seller
                const seller = yield models_1.Seller.findByIdAndDelete(sellerId);
                if (!seller) {
                    res.status(404).json({
                        success: false,
                        message: "Seller not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Account deleted successfully",
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to delete account",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Manage all user
     */
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.Seller.find();
                const sellers = yield models_1.User.find();
                const allUsers = [...users, ...sellers];
                res.status(200).json({
                    success: true,
                    message: "Users retrieved successfully",
                    data: allUsers,
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch users account",
                    error: error.message,
                });
                return;
            }
        });
    }
    /**
     * Manage all users order
     */
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield models_1.Order.find();
                res.status(200).json({
                    success: true,
                    message: "Orders retrieved successfully",
                    data: orders,
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch orders account",
                    error: error.message,
                });
                return;
            }
        });
    }
}
exports.default = SellerController;

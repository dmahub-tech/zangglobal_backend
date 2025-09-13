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
exports.AuthController = void 0;
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const token_service_1 = require("../services/token.service");
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthController {
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
            expiresIn: "24h",
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, phone } = req.body;
                // Check if user exists
                const existingUser = yield models_1.User.findOne({ email });
                if (existingUser) {
                    res.status(400).json({ status: false, message: "User already exists" });
                    return;
                }
                // Hash password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                // Create user
                const user = new user_model_1.default({
                    name,
                    email,
                    password: hashedPassword,
                    userId: (0, uuid_1.v4)(),
                    phone: phone || "not available",
                });
                yield user.save();
                // Generate token
                const token = this.generateToken(user.userId);
                res.status(201).json({
                    status: true,
                    token,
                    user: {
                        userId: user.userId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    },
                    message: "User registered successfully.",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error registering user", error });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Find user
                const user = yield models_1.User.findOne({ email });
                if (!user) {
                    res.status(401).json({ status: false, message: "Invalid credentials" });
                    return;
                }
                // Verify password
                const isPasswordValid = yield user.comparePassword(password);
                if (!isPasswordValid) {
                    res.status(401).json({ status: false, message: "Invalid credentials" });
                    return;
                }
                // Generate token
                const token = this.generateToken(user.userId);
                res.status(200).json({
                    status: true,
                    token,
                    user: {
                        userId: user.userId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    },
                    message: "Login successfully",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error logging in", error });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const updateData = req.body;
                // Remove sensitive fields from update data
                delete updateData.password;
                delete updateData.email;
                delete updateData.userId;
                const user = yield models_1.User.findOneAndUpdate({ userId }, updateData, {
                    new: true,
                });
                if (!user) {
                    res.status(404).json({ status: false, message: "User not found" });
                    return;
                }
                res.status(200).json({
                    status: true,
                    user: {
                        userId: user.userId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        accountStatus: user.accountStatus,
                    },
                    message: "Updated user profile successfully",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error updating user", error });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { currentPassword, newPassword } = req.body;
                const user = yield models_1.User.findOne({ userId });
                if (!user) {
                    res.status(404).json({ status: false, message: "User not found" });
                    return;
                }
                // Verify current password
                const isPasswordValid = yield user.comparePassword(currentPassword);
                if (!isPasswordValid) {
                    res
                        .status(401)
                        .json({ status: false, message: "Current password is incorrect" });
                    return;
                }
                // Hash new password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
                user.password = hashedPassword;
                yield user.save();
                res
                    .status(200)
                    .json({ status: true, message: "Password updated successfully" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error changing password", error });
            }
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield models_1.User.findOne({ userId });
                if (!user) {
                    res.status(404).json({ status: false, message: "User not found" });
                    return;
                }
                res.status(200).json({
                    status: true,
                    user: {
                        userId: user.userId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        accountStatus: user.accountStatus,
                    },
                    message: "Updated profile successfully",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error fetching user profile", error });
            }
        });
    }
    updateAccountStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { status } = req.body;
                const user = yield models_1.User.findOneAndUpdate({ userId }, { accountStatus: status }, { new: true });
                if (!user) {
                    res.status(404).json({ status: false, message: "User not found" });
                    return;
                }
                res.status(200).json({
                    status: user.accountStatus,
                    message: "Account status updated successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: "Error updating account status",
                    error,
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Invalidate the token by adding it to a blacklist
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (token) {
                    // Assuming you have a blacklist mechanism, e.g., a Redis store
                    yield (0, token_service_1.blacklistToken)(token);
                }
                res.status(200).json({
                    status: true,
                    message: "Logged out successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: "Error logging out",
                    error,
                });
            }
        });
    }
}
exports.AuthController = AuthController;

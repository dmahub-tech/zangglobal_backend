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
exports.authenticateSeller = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const enums_1 = require("../enums");
const authenticateSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authentication required. No token provided.",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key" // Make sure this matches your token generation secret
        );
        console.log("Decoded token:", decoded); // Debug: See what's in the token
        // Find seller by sellerId (which is what we stored in the token)
        const seller = yield models_1.Seller.findOne({ sellerId: decoded.sellerId });
        if (!seller) {
            console.log("Seller not found with ID:", decoded.sellerId);
            res.status(404).json({
                success: false,
                message: "Seller not found",
            });
            return;
        }
        // Check if logged in (using the enum from your system)
        if (seller.loggedIn !== enums_1.ELoginStatus.LOGGED_IN) {
            res.status(401).json({
                success: false,
                message: "Session expired. Please login again.",
            });
            return;
        }
        // Attach seller info to request
        req.seller = {
            id: seller._id,
            email: seller.email,
            role: seller.role || "seller",
        };
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid token or expired session",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
        return;
    }
});
exports.authenticateSeller = authenticateSeller;

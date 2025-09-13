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
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
require("dotenv/config");
class ShiprocketService {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
        this.validateEnvironmentVariables();
    }
    validateEnvironmentVariables() {
        const requiredEnvVars = [
            "SHIPROCKET_URL",
            "SHIPROCKET_EMAIL",
            "SHIPROCKET_PASSWORD",
            "SHIPROCKET_SECRET",
            "REDIRECT_URL",
        ];
        const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
        if (missingVars.length) {
            throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
        }
    }
    static getInstance() {
        if (!ShiprocketService.instance) {
            ShiprocketService.instance = new ShiprocketService();
        }
        return ShiprocketService.instance;
    }
    calculateHmacSha256(content) {
        const secret = process.env.SHIPROCKET_SECRET;
        if (!secret) {
            throw new Error("SHIPROCKET_SECRET environment variable is not set");
        }
        try {
            return crypto_1.default
                .createHmac("sha256", secret)
                .update(content)
                .digest("base64");
        }
        catch (error) {
            console.error("Error calculating HMAC:", error);
            throw new Error("Failed to calculate HMAC signature");
        }
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const url = (_a = process.env.SHIPROCKET_URL) === null || _a === void 0 ? void 0 : _a.concat("/auth/login");
            console.log("Attempting to connect to URL:", url);
            console.log("Using email:", process.env.SHIPROCKET_EMAIL);
            if (!url) {
                throw new Error("SHIPROCKET_URL environment variable is not set");
            }
            try {
                const response = yield axios_1.default.post(url, {
                    email: process.env.SHIPROCKET_EMAIL,
                    password: process.env.SHIPROCKET_PASSWORD,
                });
                // Log the entire response
                console.log("Shiprocket Response:", JSON.stringify(response.data, null, 2));
                const token = response.data.token;
                console.log("Ship to rocket token: ", token);
                this.token = token;
                this.tokenExpiry = new Date(response.data.expires_at);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("Axios Error Details:", {
                        status: (_b = error.response) === null || _b === void 0 ? void 0 : _b.status,
                        statusText: (_c = error.response) === null || _c === void 0 ? void 0 : _c.statusText,
                        data: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data,
                        headers: (_e = error.response) === null || _e === void 0 ? void 0 : _e.headers,
                    });
                }
                console.error("Failed to refresh Shiprocket token:", error);
                throw new Error(error instanceof Error
                    ? `Shiprocket authentication failed: ${error.message}`
                    : "Shiprocket authentication failed");
            }
        });
    }
    ensureValidToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token || !this.tokenExpiry || new Date() > this.tokenExpiry) {
                yield this.refreshToken();
            }
            return this.token;
        });
    }
    createOrder(cartData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!cartData.items || cartData.items.length === 0) {
                throw new Error("Invalid cart data: Cart must contain items");
            }
            const token = yield this.ensureValidToken();
            const timestamp = new Date().toISOString();
            const payload = {
                cart_data: cartData,
                redirect_url: process.env.REDIRECT_URL,
                timestamp,
            };
            const signature = this.calculateHmacSha256(JSON.stringify(payload));
            try {
                const response = yield axios_1.default.post(process.env.SHIPROCKET_URL, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Api-HMAC-SHA256": signature,
                        "Content-Type": "application/json",
                    },
                });
                if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.token)) {
                    throw new Error("Invalid response from Shiprocket: Missing token");
                }
                return response.data.result.token;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("Shiprocket API Error:", {
                        status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status,
                        data: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data,
                    });
                    throw new Error(`Shiprocket API Error: ${((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) || error.message}`);
                }
                throw error;
            }
        });
    }
}
exports.default = new ShiprocketService();

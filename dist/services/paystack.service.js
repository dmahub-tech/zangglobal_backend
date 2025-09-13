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
exports.PaystackService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PaystackService {
    constructor() {
        this.baseUrl = "https://api.paystack.co";
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!this.secretKey) {
            console.error("PAYSTACK_SECRET_KEY is not defined in environment variables");
            throw new Error("Paystack secret key is required");
        }
    }
    /**
     * Initialize a payment transaction
     * @param email Customer email
     * @param amount Amount in kobo (Naira * 100)
     * @param reference Optional unique transaction reference
     * @param metadata Optional additional data to store with transaction
     * @param callbackUrl URL to redirect to after payment
     * @returns Promise with payment initialization result
     */
    initiatePayment(email, amount, reference, metadata, callbackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.baseUrl}/transaction/initialize`, {
                    email,
                    amount: Math.round(amount) * 100, // coverts from kobo to naira
                    reference,
                    metadata,
                    callback_url: callbackUrl,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error("[PaystackService] Payment initiation failed:", error);
                throw error;
            }
        });
    }
    /**
     * Verify a payment transaction
     * @param reference Transaction reference
     * @returns Promise with verification result
     */
    verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, {
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error("[PaystackService] Payment verification failed:", error);
                throw error;
            }
        });
    }
    /**
     * List banks available in Nigeria
     * @returns Promise with list of banks
     */
    listBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/bank`, {
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error("[PaystackService] Fetching banks failed:", error);
                throw error;
            }
        });
    }
}
exports.PaystackService = PaystackService;

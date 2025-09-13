"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
// Payment routes
router.post("/process-payment", paymentController.initiatePayment);
router.get("/verify-payment/:reference", paymentController.verifyPayment);
router.post("/webhook", paymentController.webhook);
router.get("/banks", paymentController.getBanks);
exports.default = router;

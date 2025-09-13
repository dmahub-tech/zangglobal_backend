"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
const orderController = new order_controller_1.OrderController();
// Checkout and payment routes
router.post("/checkout", orderController.initiateCheckout);
// router.post("/process-payment", orderController.processPayment);
// router.get("/confirm-payment/:reference", orderController.confirmPayment);
// Order management routes
router.get("/:orderId", orderController.getOrder);
router.get("/user/:userId", orderController.getUserOrders);
router.patch("/:orderId/status", orderController.updateOrderStatus);
exports.default = router;

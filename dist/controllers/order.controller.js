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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
const paystack_service_1 = require("../services/paystack.service");
class OrderController {
    constructor() {
        this.paystackService = new paystack_service_1.PaystackService();
    }
    // Step 1: Initiate checkout process (create pending order)
    initiateCheckout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, cartId, address, email, name, paymentMethod } = req.body;
                // Add this before creating a new order
                const existingPendingOrder = yield models_1.Order.findOne({
                    userId,
                    cartId,
                    status: "Pending",
                    paymentStatus: "Pending",
                });
                if (existingPendingOrder) {
                    // Return the existing pending order instead of creating a new one
                    res.status(200).json({
                        success: true,
                        message: "Using existing pending order",
                        data: {
                            orderId: existingPendingOrder.orderId,
                            amount: existingPendingOrder.price,
                            email: existingPendingOrder.email,
                        },
                    });
                    return;
                }
                // Validate cart and stock
                const cart = yield models_1.Cart.findOne({ userId });
                if (!cart || cart.productsInCart.length === 0) {
                    res.status(400).json({ success: false, message: "Cart is empty" });
                    return;
                }
                // Check product stock
                for (const item of cart.productsInCart) {
                    const product = yield models_1.Product.findOne({ productId: item.productId });
                    if (!product || product.inStockValue < item.quantity) {
                        res.status(400).json({
                            success: false,
                            message: `Insufficient stock for product: ${item.name}`,
                        });
                        return;
                    }
                }
                // Create a new order with "Pending" status
                const orderId = (0, uuid_1.v4)();
                const order = new models_1.Order({
                    orderId,
                    userId,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    address,
                    email,
                    name,
                    productIds: cart.productsInCart.map((item) => item.productId),
                    products: cart.productsInCart, // Store full product details
                    price: cart.total,
                    paymentMethod,
                    status: "Pending",
                    paymentStatus: "Pending",
                    updatedAt: new Date(),
                });
                yield order.save();
                // Return order details and cart info for payment processing
                res.status(201).json({
                    success: true,
                    message: "Checkout initiated successfully",
                    data: {
                        orderId: order.orderId,
                        amount: order.price,
                        email: order.email,
                    },
                });
            }
            catch (error) {
                console.error("[Order] Checkout initiation failed:", error);
                res.status(500).json({
                    success: false,
                    message: "Error initiating checkout",
                    error: error.message,
                });
            }
        });
    }
    // Step 2: Process payment (this will be called by the frontend after checkout)
    // public async processPayment(req: Request, res: Response): Promise<void> {
    // 	try {
    // 		const { orderId, email, callbackUrl } = req.body;
    // 		// Find the order
    // 		const order = await Order.findOne({ orderId });
    // 		if (!order) {
    // 			res.status(404).json({ success: false, message: "Order not found" });
    // 			return;
    // 		}
    // 		// Initiate payment with Paystack
    // 		const paymentResponse = await this.paystackService.initiatePayment(
    // 			email,
    // 			order.price,
    // 			orderId, // Use orderId as reference
    // 			{ orderId: order.orderId, userId: order.userId },
    // 			callbackUrl
    // 		);
    // 		res.status(200).json({
    // 			success: true,
    // 			message: "Payment initiated successfully",
    // 			data: {
    // 				authorizationUrl: paymentResponse.data.authorization_url,
    // 				reference: paymentResponse.data.reference,
    // 				accessCode: paymentResponse.data.access_code,
    // 			},
    // 		});
    // 	} catch (error) {
    // 		console.error("[Order] Payment processing failed:", error);
    // 		res.status(500).json({
    // 			success: false,
    // 			message: "Error processing payment",
    // 			error: (error as Error).message,
    // 		});
    // 	}
    // }
    // Step 3: Confirm payment and complete order
    // public async confirmPayment(req: Request, res: Response): Promise<void> {
    // 	try {
    // 		const { reference } = req.params;
    // 		// Verify payment with Paystack
    // 		const verificationData = await this.paystackService.verifyPayment(
    // 			reference
    // 		);
    // 		// Find the order using the reference
    // 		const order = await Order.findOne({ paymentReference: reference });
    // 		if (!order) {
    // 			res.status(404).json({ success: false, message: "Order not found" });
    // 			return;
    // 		}
    // 		if (verificationData.data.status === "success") {
    // 			// Payment successful, update order status
    // 			order.status = "Processing";
    // 			order.paymentStatus = "Paid";
    // 			order.updatedAt = new Date();
    // 			await order.save();
    // 			// Update product inventory
    // 			for (const item of order.products) {
    // 				await Product.findOneAndUpdate(
    // 					{ productId: item.productId },
    // 					{
    // 						$inc: {
    // 							inStockValue: -item.quantity,
    // 							soldStockValue: item.quantity,
    // 						},
    // 					}
    // 				);
    // 			}
    // 			// Clear the cart
    // 			const cart = await Cart.findOne({ userId: order.userId });
    // 			if (cart) {
    // 				cart.productsInCart = [];
    // 				cart.total = 0;
    // 				cart.updatedAt = new Date();
    // 				await cart.save();
    // 			}
    // 			res.status(200).json({
    // 				success: true,
    // 				message: "Payment confirmed and order processed successfully",
    // 				data: {
    // 					orderId: order.orderId,
    // 					status: order.status,
    // 					paymentStatus: order.paymentStatus,
    // 				},
    // 			});
    // 		} else {
    // 			// Payment failed, update order status
    // 			order.paymentStatus = "Failed";
    // 			order.updatedAt = new Date();
    // 			await order.save();
    // 			res.status(200).json({
    // 				success: false,
    // 				message: "Payment verification failed",
    // 				data: {
    // 					orderId: order.orderId,
    // 					status: order.status,
    // 					paymentStatus: order.paymentStatus,
    // 				},
    // 			});
    // 		}
    // 	} catch (error) {
    // 		console.error("[Order] Payment confirmation failed:", error);
    // 		res.status(500).json({
    // 			success: false,
    // 			message: "Error confirming payment",
    // 			error: (error as Error).message,
    // 		});
    // 	}
    // }
    // Get a specific order
    getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const order = yield models_1.Order.findOne({ orderId });
                if (!order) {
                    res.status(404).json({ success: false, message: "Order not found" });
                    return;
                }
                res.status(200).json({ success: true, data: order });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error fetching order",
                    error: error.message,
                });
            }
        });
    }
    // Get all orders for a user
    getUserOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const orders = yield models_1.Order.find({ userId }).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: orders });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error fetching user orders",
                    error: error.message,
                });
            }
        });
    }
    // Update order status (for admin purposes)
    updateOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const { status } = req.body;
                const order = yield models_1.Order.findOneAndUpdate({ orderId }, {
                    status,
                    updatedAt: new Date(),
                }, { new: true });
                if (!order) {
                    res.status(404).json({ success: false, message: "Order not found" });
                    return;
                }
                res.status(200).json({ success: true, data: order });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error updating order status",
                    error: error.message,
                });
            }
        });
    }
}
exports.OrderController = OrderController;

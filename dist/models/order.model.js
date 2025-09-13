"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    date: String,
    time: String,
    address: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    productIds: [{ type: String }],
    products: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            img: [String],
            category: String,
        },
    ],
    trackingId: String,
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Debit Card", "Net Banking", "UPI", "COD", "Online"],
        required: true,
        default: "Online",
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Unpaid", "Failed", "Refunded", "Pending"],
        default: "Pending",
    },
    paymentReference: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
const OrderModel = (0, mongoose_1.model)("Order", OrderSchema);
exports.default = OrderModel;

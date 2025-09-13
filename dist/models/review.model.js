"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
const ReviewModel = (0, mongoose_1.model)("Review", ReviewSchema);
exports.default = ReviewModel;
